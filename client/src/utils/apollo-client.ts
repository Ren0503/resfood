import {
    ApolloLink,
    ApolloClient,
    createHttpLink,
    InMemoryCache,
    makeVar,
    NormalizedCacheObject,
    ReactiveVar
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

export const TOKEN: string = "TOKEN";
const localStorageToken: string | null = localStorage.getItem(TOKEN);

export const isLoggedInVar: ReactiveVar<boolean> = makeVar(Boolean(localStorageToken));
export const tokenVar: ReactiveVar<string | null> = makeVar(localStorageToken);

const httpLink: ApolloLink = createHttpLink({
    uri: "http://localhost:4000/graphql",
});

const authLink: ApolloLink = setContext((_, { headers }) => {
    const token = localStorage.getItem(TOKEN);
    const result = { headers: { ...headers, token: token || "" } };
    return result;
});


const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    isLoggedIn: {
                        read() {
                            console.log("isLoggedInVar()", isLoggedInVar());
                            return isLoggedInVar();
                        },
                    },
                    token: {
                        read() {
                            console.log("tokenVar()", tokenVar());
                            return tokenVar();
                        },
                    },
                },
            },
        },
    }),
});

export default client;