export interface DetailCustomer {
    nama_sesuai_ktp: string;
    debitur_nama_sesuai_ktp: string;
    alamat_domisili: string;
    no_hp_1: string;
    debitur_no_hp_1: string;
    alamat_debitur: AlamatDebitur;
}

export interface AlamatDebitur {
    alamat_domisili: {
        alamat: ''
    }
}

export interface DetailKendaraan {
    obj_desc: string;
    brand_desc: string;
    type_desc: string;
    model_desc: string;
    obj_year: string;
    financing_object_desc: string;
}

export interface StrukturKredit {
    obj_price: string;
    tenor: string;
    down_payment: string;
    installment_amount: string;
    calculation_structure_credit: CalculationStructureCredit;
}

export interface CalculationStructureCredit {
    installment_amount: string;
}

export interface ObjectHeader {
    financing_obj_desc: string;
}
