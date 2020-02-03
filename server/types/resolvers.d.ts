interface Arguments {
    siteName?: string;
    siteInput: {
        siteName: string;
        mainURL: string;
        categoryURL: string;
        productURL: string;
    };
}

interface SignInArguments {
    clientData: {
        userName?: string;
        email?: string;
        clientToken?: string;
        userID?: string;
        error?: string;
    };
}

interface AdminEditArgs {
    email: string;
}

interface Element {}
interface Node {}
interface NodeListOf<TNode = Node> {}
