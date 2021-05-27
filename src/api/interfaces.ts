import * as t from 'io-ts';
import reporter from "io-ts-reporters";
import json5 from "json5"

function optional<RT extends t.Any>(
    type: RT,
    name: string = `${type.name} | undefined`
): t.UnionType<
    [RT, t.UndefinedType],
    t.TypeOf<RT> | undefined,
    t.OutputOf<RT> | undefined,
    t.InputOf<RT> | undefined
> {
    return t.union<[RT, t.UndefinedType]>([type, t.undefined], name);
}

export async function decode<T, O, I>(
    validator: t.Type<T, O, I>,
    input: I | string,
): Promise<[string | null, T | null]> {
    if (typeof (input) === "string") {
        try { input = json5.parse(input) }
        catch (e) { return ["JSON parsing error", null] };
        // input = await Promise.resolve(JSON.parse(input)).catch(e=>error=e);
    }
    const result = validator.decode(input as I);
    if (result._tag === "Left") {
        const error = reporter.report(result).join(", ");
        return [error, null];
    }

    return [null, result.right];
}


// Restruicted Array
// https://stackoverflow.com/questions/57429769/how-to-validate-array-length-with-io-ts
/*
interface IMinMaxArray<T> extends Array<T> {
    readonly minMaxArray: unique symbol
}
export const minMaxArray = <C extends t.Mixed>(min: number, max: number, a: C) => t.brand(
    t.array(a),
    (n: Array<C>): n is t.Branded<Array<C>, IMinMaxArray<C>> => min < n.length && n.length < max,
    'minMaxArray'
);
*/




// export const idC = t.type({ id: t.string });
// export const LocationC = t.type({ lat: t.number, lng: t.number });
// // export const CoordinateC = minMaxArray(2, 2, t.number);
// export const CoordinateC = t.tuple([t.number, t.number]);
// export const GeofenceC = t.type({
//     id: t.string,
//     name: t.string,
//     shape: t.union([t.literal("circle"), t.literal("polygon")]),
//     center: LocationC,
//     radius: t.number,
//     path: optional(t.array(LocationC)),
//     address: optional(t.string),
// });
// export const GeofencesC = t.array(GeofenceC);
// export const GeofencesAddC = t.type({ id: t.string, name: optional(t.string), geofences: GeofencesC });
// export const GeofenceRemoveC = t.type({id: t.string, ids: t.array(t.string)});

// export const AssetC = t.type({
//     id: t.string,
//     name: optional(t.string),
//     location: LocationC,
// });
// export const AssetsC = t.array(AssetC);
// export const AssetsAddC = t.type({id: t.string, name: optional(t.string), assets: AssetsC});
// export const AssetsRemoveC = t.type({id: t.string, ids: t.array(t.string)});

// export const AssignC = t.type({
//     assetGroupId: t.string,
//     geofenceGroupId: t.string,
// });
// export const SetAssetLocationC = t.type({
//     assetGroupId: t.string,
//     assetId: t.string,
//     location: LocationC,
//     timeout: optional(t.number)
// })



// export type AssetI = t.TypeOf<typeof AssetC>;
// export type GeofenceI = t.TypeOf<typeof GeofenceC>;


// const BeaconType = t.union([t.literal("ID"),  t.literal("CELL" | "WIFI" | "BLE"]);
// export const BeaconIdC = t.type({ id: t.string });
// export const BeaconCellC = t.type({
//     mcc: t.number,
//     mnc: t.number,
//     lac: t.number,
//     cid: t.number,
//     radio: t.union([
//         t.literal("none"),
//         t.literal("lte"),
//         t.literal("gsm"),
//         t.literal("nbiot"),
//     ])
// })
// export const BeaconsInputC = t.array(t.union([BeaconIdC, BeaconCellC]));

// export type BeaconIdI = t.TypeOf<typeof BeaconIdC>;
// export type BeaconCellI = t.TypeOf<typeof BeaconCellC>;

export enum STATUS {
    success = "success",
    fail = "fail"
}

export enum ERROR_CODES {
    NONE,
    EMPTY_PARAMS,
    INVALID_PARAMS,
    NOT_IMPLEMENTED,
    ID_NOT_FOUND,
    DATABASE_CONNECTION_FAILED,
    NO_SUCH_MODEL,
    NO_DATA,
    INVALID_DATA,
}



export const GEN_FAIL = (errors: Error[]|string[]|null, errorCode: ERROR_CODES, params?: any) => {
    return { status: STATUS.fail, errors: errors, errorCode: errorCode, ...params}
}
export const GEN_SUCCESS = (data: any[], params?: any) => {
    return { status: STATUS.success, data: data, ...params};
}
export default {};

