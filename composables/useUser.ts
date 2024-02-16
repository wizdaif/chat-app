import {useStorage, } from "@vueuse/core";
import {generateRandom} from "~/lib/utils";

export default function () {
    let id = generateRandom(128)

    let user = useStorage('user', { id, name: null});

    const updateName = (name: string) => {
        user.value.name = name as any;
    }

    return { user, updateName }
}
