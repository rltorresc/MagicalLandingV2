import {useState, useEffect} from "react";
import {supabase} from '../lib/supabase.ts';
import {cn} from "@/lib/utils";
import Marquee from "@/components/ui/marquee";

import { getLangFromUrl, useTranslations } from "../i18n/utils";

import { defaultLang } from "../i18n/ui";

const lang = typeof window !== "undefined" ? getLangFromUrl(new URL(window.location.href)) : defaultLang;
const t = useTranslations(lang);

interface User {
  name: string;
  username: string;
  body: string;
  img: string;
}

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative overflow-hidden rounded-xl border p-4",
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <div className="overflow-hidden rounded-full w-8 h-8 flex-shrink-0">
          <img className="w-full h-full object-cover" alt="" src={img} />
        </div>
        <div className="flex flex-col w-32 overflow-hidden">
          <figcaption className="text-sm font-medium dark:text-white truncate">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40 truncate">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export default function MarqueeHorizontal() {
  const [users, setUsers] = useState<User[]>([]);
  const [duration, setDuration] = useState(20);

  useEffect(() => {
    async function fetchUsers() {
      const {data, error} = await supabase.from("users").select("*");
      if (error) {
        console.error("Error fetching users:", error);
      } else {
        const formattedUsers = data.map((user: any) => ({
          name: user.username,
          username: `@${user.name}`,
          body: t("marquee.body"),
          img: user?.avatar_url ?? `https://avatar.vercel.sh/${user.username}`,
        }));
        setUsers(formattedUsers);
        setDuration(Math.max(400, formattedUsers.length * 2));
      }
    }

    fetchUsers();
  }, []);

  // Dividimos los usuarios en dos filas
  const firstRow = users.slice(0, users.length / 2);
  const secondRow = users.slice(users.length / 2);

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-lg z-10 max-h-[600px]">
      <Marquee style={{ '--duration': `${duration}s` }}>
        {firstRow.map((user) => (
          <ReviewCard key={user.username} {...user} />
        ))}
      </Marquee>
      <Marquee reverse style={{ '--duration': `${duration}s` }}>
        {secondRow.map((user) => (
          <ReviewCard key={user.username} {...user} />
        ))}
      </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-2/6 bg-gradient-to-r from-white via-white/50 to-transparent dark:from-background dark:via-background/50 dark:to-transparent"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-2/6 bg-gradient-to-l from-white via-white/50 to-transparent dark:from-background dark:via-background/50 dark:to-transparent"></div>
    </div>
  );
}
