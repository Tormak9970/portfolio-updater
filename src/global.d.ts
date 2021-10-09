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

    interface Config {
        projects:Object,
        featured:string,
        organizations:Object[],
        experience:Object,
        art:Object[]
    }

    interface ProjectCache {
        project:Project,
        category:string,
        key:string
    }

    interface UploadResponseFormat {
        success:number,
        file:{
            url:string
        }
    }