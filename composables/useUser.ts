import {useStorage, } from "@vueuse/core";
import {generateRandom} from "~/lib/utils";

export default function () {
    let id = generateRandom(128)

    const user = useCookie('user', {
        // default: () => (),
    })

    if (!user.value) user.value = { id, name: null } as any;

    return { user }
}
