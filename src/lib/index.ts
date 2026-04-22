export const CONTACTS = {
    EMAIL: 'info@orienteeringcomo.it',
    PHONE: {
        NUMBER: '3487100208',
        PREFIX: '+39',
        full(): string {
            return `${CONTACTS.PHONE.PREFIX} ${CONTACTS.PHONE.NUMBER}`;
        }
    },
    ADDRESS: {
        STREET: 'Viale Vittorio Veneto 9',
        CITY: '22079 Villa Guardia (CO)',
        LINK: 'https://maps.app.goo.gl/MRPQuu67AEVXqtTx9',
        full(): string {
            return `${CONTACTS.ADDRESS.STREET}, ${CONTACTS.ADDRESS.CITY}`;
        }
    }
} as const;

export const FISCAL_DATA = {
    CF_CODE: '',
    IVA_CODE: '',
    FISO_CODE: '0271',
} as const;


export const CONFIG = {
    CONTACTS,
    FISCAL_DATA
} as const;