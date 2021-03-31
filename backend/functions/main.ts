import { addBookmark } from "./addBookmark";
import { deleteBookmark } from "./deleteBookmark";
import { updateBookmark } from "./updateBookmark";


exports.handler = async (event: any, context: any) => {
    switch (event.source) {
        case "appsync-add-event":
            const bookmark = {
                title: event.detail.title,
                url: event.detail.url,
                user: event.detail.user
            }
            await addBookmark(bookmark);
            break;
        case "appsync-update-event":
            const updatebookmark = {
                id: event.detail.id,
                title: event.detail.title,
                url: event.detail.url 
            }
            await updateBookmark(updatebookmark)
            break;
        case "appsync-delete-event":
            await deleteBookmark(event.detail.id)
            break;
        default:
            break;
    }
    context.succeed(event)
}