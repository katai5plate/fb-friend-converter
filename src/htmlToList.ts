interface Friend {
  id: string;
  name: string;
  image: string;
  url: string;
}

const htmlToList = (html: string): Friend[] => {
  const plainData = html
    .split("\n")
    .filter((x) =>
      x.match(
        /\[\"adp_PresenceStatusProviderSubscriptionComponentQueryRelayPreloader_[\dabcdef]/
      )
    )[0]
    .match(/\,(\{\"__bbox.*?)\]\]\]\}\);/)[1];
  const parsedData = JSON.parse(plainData).__bbox.result.data.viewer
    .chat_sidebar_contact_rankings;
  return [
    ...new Set(
      parsedData
        .map(({ status, ...rest }) => rest)
        .map((x) => JSON.stringify(x))
    ),
  ]
    .map((x: any) => JSON.parse(x))
    .filter((x) => x.user) // 退会ユーザを除外
    .map(({ user: { id, name, profile_picture: { uri: image } } }) => ({
      id,
      name,
      image,
      url: `https://www.facebook.com/profile.php?id=${id}`,
    }));
};
