export type Source={id:string;title:string;url:string;type:"url"|"pdf";authority:"official"|"secondary"|"community";date?:string;status:"queued"|"extracting"|"ok"|"failed";error?:string};
export type Area={id:string;label:string;status:"found"|"partial"|"not_found"|"conflict"};
export type Claim={id:string;sourceId:string;text:string;quote:string;verified:boolean;date?:string};
export type Finding={id:string;type:"gap"|"conflict"|"stale"|"drift"|"echo";title:string;summary:string;confidence:"low"|"med"|"high";priority:"critical"|"important"|"optional";claimIds:string[];sourceIds:string[];snapshots?:{timestamp:string;url:string}[];action:string;areaId?:string};
export type Item={id:string;findingIds:string[];priority:Finding["priority"];text:string;why:string;done:boolean};
export type Result={question:string;sources:Source[];rubric:Area[];claims:Claim[];findings:Finding[];checklist:Item[]};

export type StudentProfile = {
  name: string;
  email: string;
  college: string;
  course: string;
  year: string;
  category: string;
  state: string;
  familyIncome: string;
  gpaOrMarks: string;
};

