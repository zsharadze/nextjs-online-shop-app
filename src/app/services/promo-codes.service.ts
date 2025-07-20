"use server";
import {
  dbConnectWithCheckUserPermission,
  dbConnectWithCheckUserPermissionAdmin,
} from "@/app/data/connectMongo";
import { CreatePromoCodeDTO } from "../dtos/createPromoCodeDTO";
import { v4 as uuidv4 } from "uuid";
import { PromoCode } from "../data/models/promo-code.model";
import { pagerHelper } from "../utils/pager";
import { FilterPromoCodes } from "../dtos/filters/filter-promo-codes";
import { PromoCodesDTO } from "../dtos/promoCodesDTO";
import { PromoCodeDTO } from "../dtos/promoCodeDTO";

export const generatePromoCodes = async (
  createPromoCode: CreatePromoCodeDTO
) => {
  await dbConnectWithCheckUserPermissionAdmin();

  try {
    let promoCodes = [];
    for (let k = 0; k < createPromoCode.quantity; k++) {
      let promoCode = {
        promoCodeText: uuidv4().substring(0, 8),
        isUsed: false,
        discount: createPromoCode.discount,
        quantity: createPromoCode.quantity,
      };
      promoCodes.push(promoCode);
    }

    await PromoCode.insertMany(promoCodes);

  } catch (error: any) {
    console.log("error", error);
    throw error;
  }
};

export const getAllPromoCodes = async (
  filter: FilterPromoCodes
): Promise<PromoCodesDTO> => {
  await dbConnectWithCheckUserPermissionAdmin();

  try {
    let summaryTextAdd = "";
    let query = {};
    if (filter.searchText) {
      summaryTextAdd = ` (filtered from ${await PromoCode.countDocuments(
        {}
      )} total entries)`;
    }

    if (filter.searchText) {
      const regex = new RegExp(filter.searchText, "i"); // i for case insensitive
      query = {
        ...query,
        $or: [
          { promoCodeText: { $regex: regex } },
          { usedByUserEmail: { $regex: regex } },
        ],
      };
    }
    let totalCount = await PromoCode.countDocuments(query);
    let pagerHelperObject = await pagerHelper(
      totalCount,
      filter.pageIndex,
      filter.pageSize,
      summaryTextAdd
    );

    let result: PromoCodesDTO = {
      pager: pagerHelperObject.pager,
      promoCodeList: await PromoCode.find(query)
        .skip((filter.pageIndex - 1) * filter.pageSize)
        .limit(filter.pageSize),
    };

    return JSON.parse(JSON.stringify(result));
  } catch (error: any) {
    console.log("error", error);
    throw error;
  }
};

export const getByPromoCodeText = async (
  promoCode: string
): Promise<PromoCodeDTO> => {
  await dbConnectWithCheckUserPermission();

  try {
    let promoCodeObject = await PromoCode.findOne({
      promoCodeText: promoCode,
      isUsed: false,
    });

    return JSON.parse(JSON.stringify(promoCodeObject));
  } catch (error: any) {
    console.log("error", error);
    throw error;
  }
};

export const deletePromoCode = async (id: string): Promise<boolean> => {
  try {
    await dbConnectWithCheckUserPermissionAdmin();
    let promoCodeToDelete = await PromoCode.findById(id);
    if (promoCodeToDelete.isUsed) {
      return false;
    }

    await PromoCode.deleteOne({ _id: id });
    return true;
  } catch (error: any) {
    console.log("error", error);
    throw error;
  }
};
