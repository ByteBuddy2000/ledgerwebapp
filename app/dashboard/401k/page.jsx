import FourZeroOnePage from "./contributeTo401k";
import { contributeTo401k } from "@/controllers/contributeTo401k";

export default function Page() {
  return <FourZeroOnePage contributeTo401k={contributeTo401k} />;
}
