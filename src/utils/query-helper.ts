export default async function (queryModel: any, queries?: any, options?: any) {
    let operatorParams = ["_lt", "_gt", "_ne", "_gte", "_lte"];
    let sortParams = ["_sort", "_order"];
    let regExParams = ["_like"];
    // let relationalParams = ['_expand','_embed'];
    let globalParams = ["_keyword", "_q"];
    // let nestedParams = ["."];
    const excludeInstance = ["Number", "Date"];
    const excludePaths = ["_id", "created_at", "updated_at", "__v"];

    const paths = Object.values(queryModel.schema.paths).reduce(
        (acc: any, x: any) => {
            if (
                !excludePaths.includes(x.path) &&
                !excludeInstance.includes(x.instance)
            ) {
                return [...acc, x.path];
            }
            return Array.from(acc);
        },
        []
    );

    let searchQuery: any = {};
    let sortQuery: Record<any, any> = {};
    let paginationQuery: any = {};
    let queryCopy = structuredClone(queries);

    Object.entries(queryCopy).map(([key, value]: [string, any]) => {
        if (regExParams.find((x) => key.includes(x))) {
            let regExKey = key.split("_").slice(0, -1).join("_");
            searchQuery[regExKey] = {
                $regex: value,
                $options: "i",
            };
        } else if (!key.startsWith("_")) {
            searchQuery[key] = value;
        } else if (operatorParams.includes(key)) {
            let operatorKey = key.substring(1);
            searchQuery[`$${operatorKey}`] = value;
        } else if (sortParams.includes(key)) {
            if (key === "_sort") {
                let orderValue = (str: string) =>
                    str === "asc" ? 1 : str === "dsc" ? -1 : 0;
                let order = orderValue(queryCopy["_order"]);
                sortQuery[value] = order;
            }
        } else if (globalParams.includes(key)) {
            // if (key === "_q" ) {
            //     searchQuery["$or"] = paths?.map((path) => ({
            //         [path]: { $regex: value },
            //     }));
            // } else if (key === "_keyword") {
            //     searchQuery["$or"] = paths?.map((path) => ({
            //         [path]: { $regex: value, $options: "i" },
            //     }));
            // }
        }
    });

    const limit = Number(queryCopy._limit ?? 10);
    const page = Number(queryCopy._page ?? 1);
    const skip = limit * (page - 1);

    paginationQuery.limit = limit;
    paginationQuery.skip = skip;

    if (!Object.keys(sortQuery).length) {
        sortQuery = {
            createdAt: -1,
        };
    }
    const list = await queryModel
        .find({ ...searchQuery }, undefined, options)
        .limit(paginationQuery.limit)
        .skip(paginationQuery.skip)
        .sort(sortQuery);

    const totalItems = await queryModel.countDocuments({ ...searchQuery });
    const totalPages = Math.ceil(totalItems / limit) || 1;

    const data: {
        pagination: {
            page: number;
            limit: number;
            totalPages: number;
            totalItems: number;
            nextPage: number | null;
        };
        list: any[];
    } = {
        pagination: {
            page,
            limit,
            totalPages,
            totalItems,
            nextPage: totalPages > page ? page + 1 : null,
            // links: {
            //     self: "/route/page=${page}",
            //     next: "/route/page=${page+1}",
            // },
        },
        list,
    };
    if (data.pagination.page < data.pagination.totalPages) {
        data.pagination.nextPage = data.pagination.page + 1;
    }

    return data;
}
