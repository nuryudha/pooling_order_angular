export interface OrderId {
    order_id: string;
}

export interface PoolingOrder {
    data: PolingOrderArray[];
}

export interface PolingOrderArray {
    source_order_app_code: string;
    nama_sesuai_ktp: string;
    order_id: string;
    no_hp_1: string;
    tanggal_order: string;
    informasi_alamat: string;
    outlet_channel_desc: string;
    hasil_screening: string;
}
