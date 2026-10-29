import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { sectionQueries } from "../../query/sections.query";

export default function Section() {
 
  const { id } = useParams<{ id: string }>(); 
  const { data: sections } = useQuery(sectionQueries.all(Number(id)));
  return <></>;
}
