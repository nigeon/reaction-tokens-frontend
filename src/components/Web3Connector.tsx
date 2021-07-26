import { Web3Provider } from "@ethersproject/providers";
import Web3Modal, { getInjectedProvider }  from "web3modal";

export class Web3Connector {
    public web3Modal: any;
    public provider: any;
    public web3Provider: any;

    async init() {
        const providerOptions = {
        };

        this.web3Modal = new Web3Modal({
            cacheProvider: false, // optional
            providerOptions // required
        });

        if(this.web3Modal && this.web3Modal.cachedProvider){
            this.connect();
        }
    }

    async connect() {
        this.provider = await this.web3Modal.connect();
        this.web3Provider = new Web3Provider(this.provider);
    }

    getInjectedProvider() {
        return getInjectedProvider();
    }
}