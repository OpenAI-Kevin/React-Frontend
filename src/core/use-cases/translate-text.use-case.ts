import { TranslateTextResponse } from "../../interfaces";


export const translateTextUseCase =async( prompt: string, lang: string ) => {
    
    try {
        
        const resp = await fetch(`${ import.meta.env.VITE_GPT_API }/translate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt, lang})
        })

        if ( !resp.ok ) throw new Error('No se pudo realizar la traducción');

        const data = await resp.json() as TranslateTextResponse;

        return {
            ok: true,
            ...data
        }

    } catch (error) {
        return {
            ok: false,
            message: 'No se pudo traducir'
        }
    }

}