// apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
    reducerPath: "equipments",
    baseQuery: fetchBaseQuery({ baseUrl: "/" }), 
    endpoints: (builder) => ({
        // Define your API endpoints here
        getEquipments: builder.query({
            query: () => "/fetch_equipments",
        }),
        getTreeData: builder.query({
            query: (equipment_id) => ({
                url: "/fetch_tree",
                method: "POST",
                body: equipment_id,
            }),
        }),
    }),
});

export const { useGetEquipmentsQuery, useGetTreeDataQuery } = apiSlice;