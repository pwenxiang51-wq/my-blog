export const onRequest: PagesFunction<{
  GITHUB_CLIENT_ID: string
  GITHUB_CLIENT_SECRET: string
}> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  // 第一步：跳转到 GitHub 授权页
  if (url.pathname === "/api/oauth") {
    const authUrl = new URL("https://github.com/login/oauth/authorize");
    authUrl.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
    authUrl.searchParams.set("redirect_uri", url.origin + "/api/oauth/callback");
    authUrl.searchParams.set("scope", "repo");
    return Response.redirect(authUrl.toString());
  }

  // 第二步：接收 code，换取 access_token，并保存到 localStorage
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

    return new Response("Failed to get access token", { status: 400 });
  }

  return new Response("Not found", { status: 404 });
};
