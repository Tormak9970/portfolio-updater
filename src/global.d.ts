/// <reference types="svelte" />

	interface Settings {
		configDir:string,
		openProj:string,
		currentData:any
	}

    interface Project {
        name:string,
        time:string,
        status:string,
        difficulty:string,
        description:string,
        content:any,
        link?:string,
        imgs:string[]
    }