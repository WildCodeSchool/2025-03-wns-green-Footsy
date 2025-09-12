import { useEffect, useRef, useState } from "react";
import { useQuery } from "@apollo/client/react";

import { GET_ALL_AVATARS } from "../../graphql/operations";

import classes from "./AvatarSelector.module.scss";

import type { Avatar } from "../../types/Avatar.types";

const avatarImages = import.meta.glob("../../assets/img/avatar/*.png", {
  eager: true,
  as: "url",
}) as Record<string, string>;

const getAvatarImageUrl = (imageName: string): string => {
  const imagePath = `../../assets/img/avatar/${imageName}`;
  return avatarImages[imagePath] || "";
};

type AvatarSelectorProps = {
  selectedAvatar?: Avatar;
  onAvatarSelect: (avatar: Avatar) => void;
  label?: string;
};

interface GetAllAvatarsData {
  getAllAvatars: Avatar[];
}

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

  // TO DO: Mettre en page les chargements et erreurs
  if (loading) {
    return <div>Chargement des avatars...</div>;
  }

  if (error) {
    return <div>Erreur lors du chargement des avatars</div>;
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
      </button>

      {isOpen && (
        <div className={classes["avatar-selector__dropdown"]}>
          <div className={classes["avatar-selector__grid"]}>
            {avatars.map((avatar: Avatar) => (
              <option
                key={avatar.id}
                className={`${classes["avatar-selector__option"]} ${
                  currentAvatar?.id === avatar.id
                    ? classes["avatar-selector__option--selected"]
                    : ""
                }`}
                onClick={() => handleAvatarClick(avatar)}
                aria-selected={currentAvatar?.id === avatar.id}
              >
                <img
                  src={getAvatarImageUrl(avatar.image)}
                  alt={avatar.title}
                  className={classes["avatar-selector__option-image"]}
                />
              </option>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
