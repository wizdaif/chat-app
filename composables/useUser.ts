import {useStorage} from "@vueuse/core";
import {generateRandom} from "~/lib/utils";

export default function () {
    let user = useStorage('ncs-user', {id: generateRandom(128), name: null});
    return { user }
}
