export function parseCallbackMetadata(metadata) {
    if (!metadata?.Item) {
        return {};
    }
    return metadata.Item.reduce(
        (result, item) => {
            result[item.Name] = item.Value;
            return result;
        },
        {}
    );
}