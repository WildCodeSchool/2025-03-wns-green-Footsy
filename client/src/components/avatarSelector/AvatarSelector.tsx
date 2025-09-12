import { useEffect, useRef, useState } from "react";

import greta from "../../assets/img/avatar/icon-greta.png";
import hugoClement from "../../assets/img/avatar/icone-hugo-clement.png";
import janeGoodall from "../../assets/img/avatar/icone-jane-goodall.png";
import lorax from "../../assets/img/avatar/icone-lorax.png";
import mononoke from "../../assets/img/avatar/icone-mononoke.png";
import paulWatson from "../../assets/img/avatar/icone-paul-watson.png";
import pocahontas from "../../assets/img/avatar/icone-pocahontas.png";
import totoro from "../../assets/img/avatar/icone-totoro.png";
import wall from "../../assets/img/avatar/icone-wall.png";
import wangari from "../../assets/img/avatar/icone-wangari.png";

import classes from "./AvatarSelector.module.scss";

export type Avatar = {
  id: number;
  title: string;
  image: string;
};

const avatars: Avatar[] = [
  { id: 1, title: "Greta", image: greta },
  { id: 2, title: "Hugo Clément", image: hugoClement },
  { id: 3, title: "Jane Goodall", image: janeGoodall },
  { id: 4, title: "Lorax", image: lorax },
  { id: 5, title: "Mononoke", image: mononoke },
  { id: 6, title: "Paul Watson", image: paulWatson },
  { id: 7, title: "Pocahontas", image: pocahontas },
  { id: 8, title: "Totoro", image: totoro },
  { id: 9, title: "Wall-E", image: wall },
  { id: 10, title: "Wangari", image: wangari },
];

type AvatarSelectorProps = {
  selectedAvatar?: Avatar;
  onAvatarSelect: (avatar: Avatar) => void;
  label?: string;
};

export default function AvatarSelector({
  selectedAvatar = { id: 5, title: "Mononoke", image: mononoke },
  onAvatarSelect,
}: AvatarSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className={classes["avatar-selector"]} ref={dropdownRef}>
      <button
        type="button"
        className={classes["avatar-selector__current"]}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <img
          src={selectedAvatar.image}
          alt={selectedAvatar.title}
          className={classes["avatar-selector__current-image"]}
        />
      </button>

      {isOpen && (
        <div className={classes["avatar-selector__dropdown"]}>
          <div className={classes["avatar-selector__grid"]}>
            {avatars.map((avatar) => (
              <option
                key={avatar.id}
                className={`${classes["avatar-selector__option"]} ${
                  selectedAvatar?.id === avatar.id
                    ? classes["avatar-selector__option--selected"]
                    : ""
                }`}
                onClick={() => handleAvatarClick(avatar)}
                aria-selected={selectedAvatar?.id === avatar.id}
              >
                <img
                  src={avatar.image}
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

export { avatars };
