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
    }),
});

export const { useGetEquipmentsQuery, useGetTreeDataQuery } = apiSlice;