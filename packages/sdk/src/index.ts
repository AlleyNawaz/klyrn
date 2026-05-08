/**
 * Klyrn SDK — TypeScript wrapper for the Anchor program
 * 
 * Usage:
 *   const sdk = new KlyrnSDK(connection, wallet);
 *   await sdk.createContract({ ... });
 */

import {
  Connection,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
  Transaction,
  Keypair,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { BN, Program, AnchorProvider, Wallet } from "@coral-xyz/anchor";

// Program ID — update after `anchor build`
export const PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_PROGRAM_ID || "KlyrnXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
);

// USDC mint (devnet)
export const USDC_MINT = new PublicKey(
  process.env.NEXT_PUBLIC_USDC_MINT || "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
);

// ---- PDA Helpers ----

export function findContractPda(contractId: Buffer): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("contract"), contractId],
    PROGRAM_ID
  );
}

export function findEscrowPda(contractPda: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("escrow"), contractPda.toBuffer()],
    PROGRAM_ID
  );
}

export function findMilestonePda(contractPda: PublicKey, index: number): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("milestone"), contractPda.toBuffer(), Buffer.from([index])],
    PROGRAM_ID
  );
}

export function findReputationPda(userPubkey: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("reputation"), userPubkey.toBuffer()],
    PROGRAM_ID
  );
}

// ---- SDK Class ----

export interface CreateContractParams {
  contractIdBytes: Buffer; // 16 bytes
  freelancer: PublicKey;
  briefHash: number[]; // 32 bytes SHA-256
  totalAmount: BN;
  milestoneCount: number;
  autoApprovalSlots: BN;
}

export interface SubmitMilestoneParams {
  contractId: Buffer;
  milestoneIndex: number;
  deliverableHash: number[]; // 32 bytes SHA-256
}

export interface ResolveDisputeParams {
  contractId: Buffer;
  milestoneIndex: number;
  decision: number; // 0 = APPROVED, 1 = REJECTED, 2 = PARTIAL
  partialBps: number; // 0-10000 (basis points)
}

export class KlyrnSDK {
  private connection: Connection;
  private wallet: Wallet;

  constructor(connection: Connection, wallet: Wallet) {
    this.connection = connection;
    this.wallet = wallet;
  }

  /**
   * Derive all PDAs needed for a contract transaction
   */
  deriveContractAccounts(contractIdBytes: Buffer) {
    const [contractPda, contractBump] = findContractPda(contractIdBytes);
    const [escrowPda, escrowBump] = findEscrowPda(contractPda);
    return { contractPda, contractBump, escrowPda, escrowBump };
  }

  /**
   * Create a new escrow contract
   */
  async createContract(params: CreateContractParams): Promise<string> {
    const { contractPda, escrowPda } = this.deriveContractAccounts(params.contractIdBytes);

    const clientAta = await getAssociatedTokenAddress(USDC_MINT, this.wallet.publicKey);

    // Build instruction
    const ix = await this.buildCreateContractIx({
      contractPda,
      escrowPda,
      clientAta,
      ...params,
    });

    const tx = new Transaction().add(ix);
    tx.feePayer = this.wallet.publicKey;
    tx.recentBlockhash = (await this.connection.getLatestBlockhash()).blockhash;

    const signed = await this.wallet.signTransaction(tx);
    const sig = await this.connection.sendRawTransaction(signed.serialize());
    await this.connection.confirmTransaction(sig, "confirmed");

    return sig;
  }

  /**
   * Fund a contract's escrow
   */
  async fundContract(contractIdBytes: Buffer, amount: BN): Promise<string> {
    const { contractPda, escrowPda } = this.deriveContractAccounts(contractIdBytes);
    const clientAta = await getAssociatedTokenAddress(USDC_MINT, this.wallet.publicKey);

    // Build a fund instruction (simplified — full implementation uses Anchor IDL)
    const data = Buffer.alloc(8 + 8);
    // instruction discriminator for "fund_contract"
    data.writeUInt8(1, 0); // placeholder discriminator
    amount.toArrayLike(Buffer, "le", 8).copy(data, 8);

    const ix = new TransactionInstruction({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: this.wallet.publicKey, isSigner: true, isWritable: true },
        { pubkey: contractPda, isSigner: false, isWritable: true },
        { pubkey: escrowPda, isSigner: false, isWritable: true },
        { pubkey: clientAta, isSigner: false, isWritable: true },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      ],
      data,
    });

    const tx = new Transaction().add(ix);
    tx.feePayer = this.wallet.publicKey;
    tx.recentBlockhash = (await this.connection.getLatestBlockhash()).blockhash;

    const signed = await this.wallet.signTransaction(tx);
    const sig = await this.connection.sendRawTransaction(signed.serialize());
    await this.connection.confirmTransaction(sig, "confirmed");

    return sig;
  }

  /**
   * Accept a contract (freelancer)
   */
  async acceptContract(contractIdBytes: Buffer): Promise<string> {
    const { contractPda } = this.deriveContractAccounts(contractIdBytes);

    const data = Buffer.alloc(8);
    data.writeUInt8(2, 0); // placeholder discriminator for accept_contract

    const ix = new TransactionInstruction({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: this.wallet.publicKey, isSigner: true, isWritable: true },
        { pubkey: contractPda, isSigner: false, isWritable: true },
      ],
      data,
    });

    const tx = new Transaction().add(ix);
    tx.feePayer = this.wallet.publicKey;
    tx.recentBlockhash = (await this.connection.getLatestBlockhash()).blockhash;

    const signed = await this.wallet.signTransaction(tx);
    const sig = await this.connection.sendRawTransaction(signed.serialize());
    await this.connection.confirmTransaction(sig, "confirmed");

    return sig;
  }

  /**
   * Submit a milestone deliverable
   */
  async submitMilestone(params: SubmitMilestoneParams): Promise<string> {
    const { contractPda } = this.deriveContractAccounts(params.contractId);
    const [milestonePda] = findMilestonePda(contractPda, params.milestoneIndex);

    const data = Buffer.alloc(8 + 32);
    data.writeUInt8(4, 0); // placeholder discriminator
    Buffer.from(params.deliverableHash).copy(data, 8);

    const ix = new TransactionInstruction({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: this.wallet.publicKey, isSigner: true, isWritable: true },
        { pubkey: contractPda, isSigner: false, isWritable: true },
        { pubkey: milestonePda, isSigner: false, isWritable: true },
      ],
      data,
    });

    const tx = new Transaction().add(ix);
    tx.feePayer = this.wallet.publicKey;
    tx.recentBlockhash = (await this.connection.getLatestBlockhash()).blockhash;

    const signed = await this.wallet.signTransaction(tx);
    const sig = await this.connection.sendRawTransaction(signed.serialize());
    await this.connection.confirmTransaction(sig, "confirmed");

    return sig;
  }

  /**
   * Fetch on-chain contract state
   */
  async getContractState(contractIdBytes: Buffer) {
    const [contractPda] = findContractPda(contractIdBytes);
    const accountInfo = await this.connection.getAccountInfo(contractPda);
    if (!accountInfo) return null;

    // TODO: Deserialize using Anchor IDL once program is built
    return {
      address: contractPda.toBase58(),
      data: accountInfo.data,
      lamports: accountInfo.lamports,
    };
  }

  // ---- Private Helpers ----

  private async buildCreateContractIx(params: {
    contractPda: PublicKey;
    escrowPda: PublicKey;
    clientAta: PublicKey;
  } & CreateContractParams): Promise<TransactionInstruction> {
    // Build instruction data
    // In production, this is generated from the Anchor IDL
    const data = Buffer.alloc(8 + 16 + 32 + 8 + 1 + 8);
    data.writeUInt8(0, 0); // placeholder discriminator for create_contract
    params.contractIdBytes.copy(data, 8);
    Buffer.from(params.briefHash).copy(data, 24);
    params.totalAmount.toArrayLike(Buffer, "le", 8).copy(data, 56);
    data.writeUInt8(params.milestoneCount, 64);
    params.autoApprovalSlots.toArrayLike(Buffer, "le", 8).copy(data, 65);

    return new TransactionInstruction({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: this.wallet.publicKey, isSigner: true, isWritable: true },
        { pubkey: params.freelancer, isSigner: false, isWritable: false },
        { pubkey: params.contractPda, isSigner: false, isWritable: true },
        { pubkey: params.escrowPda, isSigner: false, isWritable: true },
        { pubkey: USDC_MINT, isSigner: false, isWritable: false },
        { pubkey: params.clientAta, isSigner: false, isWritable: true },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
      ],
      data,
    });
  }
}

// Re-export everything from types
export * from "@klyrn/types";
