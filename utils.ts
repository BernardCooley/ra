export const removeDuplicates = (arr: any[], value: string): any[] => {
    const uniqueIds: string[] = [];

    const unique = arr.filter((element) => {
        const isDuplicate = uniqueIds.includes(element[value]);

        if (!isDuplicate) {
            uniqueIds.push(element[value]);

            return true;
        }

        return false;
    });

    return unique;
};

export const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
