export default function (message: string) {
    const { user } = useUser();
    if (user.value) {
        const {id,name} = user.value;
        return useFetch('/api/new', {
            body: {message, from:id},
            method: 'post'
        })
    }
}