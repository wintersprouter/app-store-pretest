import { appSchema } from "@/services/apis/types";
import Image from "next/image";
import { z } from "zod";

interface GrossingAppItemProps {
  entry: z.infer<typeof appSchema>;
}

function GrossingAppItem({ entry }: GrossingAppItemProps) {
  const { id, category } = entry;
  return (
    <li key={id.attributes["im:id"]} className="w-20 h-full flex-shrink-0">
      <div className="flex flex-row items-center gap-4">
        <Image
          src={entry["im:image"][1].label}
          alt={entry["im:name"].label}
          width={75}
          height={75}
          className="rounded-2xl"
        />
      </div>
      <div className="flex flex-col justify-start gap-1 mt-4">
        <h2 className="text-md font-bold text-wrap break-words">
          {entry["im:name"].label}
        </h2>
        <p className="text-sm text-gray-500 text-wrap">
          {category.attributes.label}
        </p>
      </div>
    </li>
  );
}
export default GrossingAppItem;
