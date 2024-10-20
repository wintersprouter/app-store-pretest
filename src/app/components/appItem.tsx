import { List, Rate } from "antd";
import Image from "next/image";
import { TopFreeData } from "../page";

type AppItemProps = {
  entry: TopFreeData;
  index: number;
};

function AppItem({ entry, index }: AppItemProps) {
  return (
    <List.Item className="mx-8">
      <div className="flex flex-row items-center gap-4 md:w-[550px]">
        <span className="text-[#9D9E9D]">{index + 1}</span>
        <Image
          src={entry.image}
          alt={entry.imageAlt}
          width={53}
          height={53}
          className="rounded-full"
          priority
        />
        <div className="flex flex-col justify-start gap-1">
          <h2 className="text-xl font-bold">{entry.name}</h2>
          <p className="text-sm text-gray-500">{entry.category}</p>
          <div className="flex gap-1">
            <Rate
              allowHalf
              style={{ color: "#FE9503" }}
              disabled
              value={entry.details?.averageUserRating}
            />
            <p className="text-sm text-gray-500">
              {`(${entry.details?.userRatingCount.toLocaleString()})`}
            </p>
          </div>
        </div>
      </div>
    </List.Item>
  );
}

export default AppItem;
