export const onRequest: PagesFunction<{
  GITHUB_CLIENT_ID: string
  GITHUB_CLIENT_SECRET: string
}> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (url.pathname === "/api/oauth") {
    return Response.redirect(
      `https://github.com/login/oauth/authorize?client_id=${env.GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(url.origin + "/api/oauth/callback")}`
    );
  }

  if (url.pathname === "/api/oauth/callback" && code) {
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenResponse.json<{ access_token: string }>();
    const accessToken = tokenData.access_token;

    if (accessToken) {
      return new Response(
        `<script>
          localStorage.setItem("netlify-cms-user", JSON.stringify({ token: "${accessToken}" }));
          window.location.href = "/admin/";
        </script>`,
        { headers: { "Content-Type": "text/html" } }
      );
    }
  }

  return new Response("Authentication failed", { status: 400 });
};
