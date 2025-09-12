const avatarImages = import.meta.glob("../../assets/img/avatar/*.png", {
  eager: true,
  as: "url",
}) as Record<string, string>;

export const getAvatarImageUrl = (imageName: string): string => {
  const imagePath = `../../assets/img/avatar/${imageName}`;
  return avatarImages[imagePath] || "";
};
