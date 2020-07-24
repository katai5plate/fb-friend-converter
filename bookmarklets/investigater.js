(() => {
  if (window.bmlIsLoaded) return;
  window.bmlIsLoaded = true;
  let error,
    html = "",
    plainData,
    parsedData,
    data;

  try {
    html = document.body.innerHTML;
    plainData = html
      .split("\n")
      .filter((x) =>
        x.match(
          /\[\"adp_PresenceStatusProviderSubscriptionComponentQueryRelayPreloader_[\dabcdef]/
        )
      )[0]
      .match(/\,(\{\"__bbox.*?)\]\]\]\}\);/)[1];
    parsedData = JSON.parse(plainData).__bbox.result.data.viewer
      .chat_sidebar_contact_rankings;
    data = [
      ...new Set(
        parsedData
          .map(({ status, ...rest }) => rest)
          .map((x) => JSON.stringify(x))
      ),
    ]
      .map((x) => JSON.parse(x))
      .filter((x) => x.user); // 退会ユーザを除外
  } catch (e) {
    error = e.stack;
  }

  document.body.innerHTML = `<div style="color:#fff;background-color:#000;"><p style="font-size:large;">調査結果</p><p>この画面をスクリーンショットして送ってください</p><textarea style="width: 100%" rows="20">${JSON.stringify(
    {
      e: error,
      h: location.href,
      jp: html.includes("ja_JP"),
      ks: html.includes("ja_KS"),
      pd: parsedData && parsedData.length,
      d: data && data.length,
      ua: navigator.userAgent,
    },
    null,
    2
  )}</textarea></div>`;
})();
