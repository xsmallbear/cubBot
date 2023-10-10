import http from "http";

interface HitokotoType {
  id: string;
  hitokoto: string;
  type: string;
  from: string;
  from_who: string;
  creator: string;
  creator_uid: string;
  reviewer: string;
  uuid: string;
  commit_from: string;
  created_at: string;
  length: string;
}

const hitokotoUtil = (): Promise<HitokotoType> => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "international.v1.hitokoto.cn",
      port: 80,
      path: "/",
      agent: false,
    };
    http.get(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve(JSON.parse(data));
      });
    });
  });
};

export type { HitokotoType };
export default hitokotoUtil;
