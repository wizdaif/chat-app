export default function (message: string) {
    const { user } = useUser();
    if (user.value) {
        const {id,name} = user.value;
        return useFetch('/api/message', {
            body: {message, from:id},
            method: 'post'
        })
    }
}