export default function IncomingTicketsPage() {
    const { data } = await SupabaseAuthClient.auth.getClaims();
    if (data) {
        const user_role = data.claims.user_role;
        if (user_role == "superadmin" or user_role == "owner")
    }

    return (
        <div></div>
    );
}
