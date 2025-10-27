import { useQuery } from "@apollo/client/react";
import { useEffect, useRef, useState } from "react";

import editIcon from "../../assets/img/logos_icons/edit.png";
import { GET_ALL_AVATARS } from "../../graphql/operations";

import type { Avatar } from "../../types/Avatar.types";
import { Loader } from "../loader/Loader";
import classes from "./AvatarSelector.module.scss";

type GetAllAvatarsData = {
  getAllAvatars: Avatar[];
};

type AvatarSelectorProps = {
  selectedAvatar?: Avatar;
  onAvatarSelect: (avatar: Avatar) => void;
  label?: string;
};

const avatarImages = import.meta.glob("../../assets/img/avatar/*.png", {
  eager: true,
  as: "url",
}) as Record<string, string>;

export const getAvatarImageUrl = (imageName: string): string => {
  const imagePath = `../../assets/img/avatar/${imageName}`;
  const imageUrl = avatarImages[imagePath];

  return imageUrl || "";
};

export default function AvatarSelector({
  selectedAvatar,
  onAvatarSelect,
}: AvatarSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data, loading, error } = useQuery<GetAllAvatarsData>(GET_ALL_AVATARS);
  const avatars: Avatar[] = data?.getAllAvatars || [];

  const currentAvatar = selectedAvatar || avatars[4];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleAvatarClick = (avatar: Avatar) => {
    onAvatarSelect(avatar);
    setIsOpen(false);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Erreur</div>;
  }

  return (
    <div className={classes["avatar-selector"]} ref={dropdownRef}>
      <button
        type="button"
        className={classes["avatar-selector__current"]}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <img
          src={getAvatarImageUrl(currentAvatar.image)}
          alt={currentAvatar.title}
          className={classes["avatar-selector__current-image"]}
        />
        <div className={classes["avatar-selector__edit-icon"]}>
          <img
            src={editIcon}
            alt="Modifier l'avatar"
            className={classes["avatar-selector__edit-icon-image"]}
          />
        </div>
      </button>

      {isOpen && (
        <div className={classes["avatar-selector__dropdown"]}>
          <div className={classes["avatar-selector__grid"]}>
            {avatars.map((avatar: Avatar) => (
              <button
                key={avatar.id}
                type="button"
                className={`${classes["avatar-selector__option"]} ${
                  currentAvatar?.id === avatar.id
                    ? classes["avatar-selector__option--selected"]
                    : ""
                }`}
                onClick={() => handleAvatarClick(avatar)}
                aria-pressed={currentAvatar?.id === avatar.id}
              >
                <img
                  src={getAvatarImageUrl(avatar.image)}
                  alt={avatar.title}
                  className={classes["avatar-selector__option-image"]}
                  loading="eager"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
