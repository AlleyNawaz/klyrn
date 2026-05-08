use anchor_lang::prelude::*;

use crate::state::*;

#[derive(Accounts)]
pub struct InitReputation<'info> {
    /// Payer — anyone can init reputation for another user (server-side on signup)
    #[account(mut)]
    pub payer: Signer<'info>,

    /// The user whose reputation is being initialized
    /// CHECK: We only read the key, no data validation needed
    pub user: UncheckedAccount<'info>,

    /// ReputationStats PDA — derived from user pubkey
    #[account(
        init,
        payer = payer,
        space = ReputationStats::SIZE,
        seeds = [b"reputation", user.key().as_ref()],
        bump,
    )]
    pub reputation: Account<'info, ReputationStats>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitReputation>) -> Result<()> {
    let reputation = &mut ctx.accounts.reputation;

    reputation.user = ctx.accounts.user.key();
    reputation.contracts_completed = 0;
    reputation.total_volume = 0;
    reputation.disputes_initiated = 0;
    reputation.disputes_lost = 0;
    reputation.on_time_milestones = 0;
    reputation.late_milestones = 0;
    reputation.bump = ctx.bumps.reputation;

    Ok(())
}
