module.exports = {
    client: {
        includes: ["./src/**/*.{ts,tsx}"],
        tagName: "gql",
        service: {
            name: "RoadFood-backend",
            url: "http://localhost:4000/graphql",
        },
    },
};
