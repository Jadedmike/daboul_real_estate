"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/admin";
import {
  Property,
  PropertyStatus,
  TransactionType,
  Governorate,
  District,
  PropertyImage,
} from "@/lib/supabase/types";

export interface PropertyWithLocation extends Property {
  governorates: { name_ar: string; name_en: string } | null;
  districts: { name_ar: string; name_en: string } | null;
}

export interface PropertyFormData {
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  property_type: string;
  transaction_type: TransactionType;
  governorate_id: string;
  district_id: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  price: number;
  currency: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  floor?: number | null;
  total_floors?: number | null;
  orientation?: string | null;
  legal_status?: string | null;
  status: PropertyStatus;
  is_featured: boolean;
  is_offer: boolean;
}

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Validates common property form input fields.
 */
function validatePropertyInput(data: Partial<PropertyFormData>): string | null {
  if (!data.title_ar || data.title_ar.trim().length < 3) {
    return "يرجى إدخال عنوان العقار باللغة العربية (3 أحرف على الأقل).";
  }
  if (!data.description_ar || data.description_ar.trim().length < 5) {
    return "يرجى إدخال وصف تفصيلي للعقار باللغة العربية.";
  }
  if (!data.property_type || data.property_type.trim() === "") {
    return "يرجى تحديد نوع العقار.";
  }
  if (!data.transaction_type || !["sale", "rent"].includes(data.transaction_type)) {
    return "يرجى تحديد نوع المعاملة (بيع أو إيجار).";
  }
  if (!data.governorate_id) {
    return "يرجى اختيار المحافظة.";
  }
  if (!data.district_id) {
    return "يرجى اختيار المنطقة أو الحي التابع للمحافظة.";
  }
  if (!data.address || data.address.trim().length < 3) {
    return "يرجى إدخال العنوان التفصيلي للعقار.";
  }
  if (data.price === undefined || data.price === null || isNaN(data.price) || data.price <= 0) {
    return "يرجى إدخال سعر صحيح أكبر من الصفر.";
  }
  if (data.area === undefined || data.area === null || isNaN(data.area) || data.area <= 0) {
    return "يرجى إدخال مساحة صحيحة بالمتر المربع أكبر من الصفر.";
  }
  if (
    !data.status ||
    !["draft", "available", "reserved", "sold", "rented", "hidden"].includes(data.status)
  ) {
    return "يرجى تحديد حالة صالحة للعقار.";
  }
  return null;
}

/**
 * Fetches all properties with governorate and district names for the admin dashboard.
 */
export async function getAdminProperties(): Promise<PropertyWithLocation[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("properties")
      .select("*, governorates(name_ar, name_en), districts(name_ar, name_en)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching admin properties:", error.message);
      return [];
    }

    return (data as unknown as PropertyWithLocation[]) || [];
  } catch (error) {
    console.error("Exception fetching admin properties:", error);
    return [];
  }
}

/**
 * Fetches a single property by its ID.
 */
export async function getPropertyById(id: string): Promise<PropertyWithLocation | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("properties")
      .select("*, governorates(name_ar, name_en), districts(name_ar, name_en)")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return data as unknown as PropertyWithLocation;
  } catch (error) {
    console.error("Exception fetching property:", error);
    return null;
  }
}

/**
 * Fetches all active governorates and districts for the dropdown selectors.
 */
export async function getLocationsData(): Promise<{
  governorates: Governorate[];
  districts: District[];
}> {
  try {
    const supabase = await createClient();

    const [govRes, distRes] = await Promise.all([
      supabase.from("governorates").select("*").eq("is_active", true).order("name_ar", { ascending: true }),
      supabase.from("districts").select("*").eq("is_active", true).order("name_ar", { ascending: true }),
    ]);

    return {
      governorates: (govRes.data as Governorate[]) || [],
      districts: (distRes.data as District[]) || [],
    };
  } catch (error) {
    console.error("Exception fetching locations:", error);
    return { governorates: [], districts: [] };
  }
}

/**
 * Creates a new property in the database.
 * Strictly verifies admin privileges and applies Supabase RLS.
 */
export async function createProperty(formData: PropertyFormData): Promise<ActionResult<Property>> {
  try {
    await requireAdmin();

    const validationError = validatePropertyInput(formData);
    if (validationError) {
      return { success: false, error: validationError };
    }

    const supabase = await createClient();

    const insertPayload = {
      title_ar: formData.title_ar.trim(),
      title_en: formData.title_en?.trim() || null,
      description_ar: formData.description_ar.trim(),
      description_en: formData.description_en?.trim() || null,
      property_type: formData.property_type.trim(),
      transaction_type: formData.transaction_type,
      governorate_id: formData.governorate_id,
      district_id: formData.district_id,
      address: formData.address.trim(),
      latitude: formData.latitude ?? null,
      longitude: formData.longitude ?? null,
      price: Number(formData.price),
      currency: formData.currency || "USD",
      area: Number(formData.area),
      bedrooms: Number(formData.bedrooms || 0),
      bathrooms: Number(formData.bathrooms || 0),
      floor: formData.floor !== null && formData.floor !== undefined ? Number(formData.floor) : null,
      total_floors: formData.total_floors !== null && formData.total_floors !== undefined ? Number(formData.total_floors) : null,
      orientation: formData.orientation?.trim() || null,
      legal_status: formData.legal_status?.trim() || null,
      status: formData.status,
      is_featured: Boolean(formData.is_featured),
      is_offer: Boolean(formData.is_offer),
    };

    const { data, error } = await supabase
      .from("properties")
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      console.error("Database insert error:", error);
      return { success: false, error: "تعذر حفظ العقار في قاعدة البيانات. يرجى التحقق من صحة المدخلات." };
    }

    revalidatePath("/admin");
    revalidatePath("/properties");

    return { success: true, data: data as Property };
  } catch (error) {
    console.error("createProperty error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "حدث خطأ غير متوقع أثناء إضافة العقار.",
    };
  }
}

/**
 * Updates an existing property.
 * Strictly verifies admin privileges and applies Supabase RLS.
 */
export async function updateProperty(
  id: string,
  formData: Partial<PropertyFormData>
): Promise<ActionResult<Property>> {
  try {
    await requireAdmin();

    const validationError = validatePropertyInput(formData);
    if (validationError) {
      return { success: false, error: validationError };
    }

    const supabase = await createClient();

    const updatePayload = {
      title_ar: formData.title_ar!.trim(),
      title_en: formData.title_en?.trim() || null,
      description_ar: formData.description_ar!.trim(),
      description_en: formData.description_en?.trim() || null,
      property_type: formData.property_type!.trim(),
      transaction_type: formData.transaction_type!,
      governorate_id: formData.governorate_id!,
      district_id: formData.district_id!,
      address: formData.address!.trim(),
      latitude: formData.latitude ?? null,
      longitude: formData.longitude ?? null,
      price: Number(formData.price),
      currency: formData.currency || "USD",
      area: Number(formData.area),
      bedrooms: Number(formData.bedrooms || 0),
      bathrooms: Number(formData.bathrooms || 0),
      floor: formData.floor !== null && formData.floor !== undefined ? Number(formData.floor) : null,
      total_floors: formData.total_floors !== null && formData.total_floors !== undefined ? Number(formData.total_floors) : null,
      orientation: formData.orientation?.trim() || null,
      legal_status: formData.legal_status?.trim() || null,
      status: formData.status!,
      is_featured: Boolean(formData.is_featured),
      is_offer: Boolean(formData.is_offer),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("properties")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Database update error:", error);
      return { success: false, error: "تعذر تحديث بيانات العقار. يرجى المحاولة لاحقاً." };
    }

    revalidatePath("/admin");
    revalidatePath("/properties");
    revalidatePath(`/properties/${id}`);

    return { success: true, data: data as Property };
  } catch (error) {
    console.error("updateProperty error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "حدث خطأ غير متوقع أثناء تحديث العقار.",
    };
  }
}

/**
 * Deletes a property.
 * Strictly verifies admin privileges and applies Supabase RLS.
 */
export async function deleteProperty(id: string): Promise<ActionResult<void>> {
  try {
    await requireAdmin();

    const supabase = await createClient();

    // 1. Fetch all storage_path values for this property from public.property_images
    const { data: images, error: fetchImagesError } = await supabase
      .from("property_images")
      .select("id, storage_path")
      .eq("property_id", id);

    if (fetchImagesError) {
      console.error("Error querying property images prior to deletion:", fetchImagesError);
      return {
        success: false,
        error: "تعذر التحقق من صور العقار قبل الحذف. لم يتم حذف العقار.",
      };
    }

    const storagePaths = (images || [])
      .map((img) => img.storage_path)
      .filter((path): path is string => Boolean(path && path.trim().length > 0));

    // 2. If there are storage objects, delete them from 'property-images' bucket
    let storageDeletedCount = 0;
    if (storagePaths.length > 0) {
      const { data: removeData, error: removeError } = await supabase.storage
        .from("property-images")
        .remove(storagePaths);

      if (removeError) {
        console.error("Storage removal error during property deletion:", removeError);
        return {
          success: false,
          error: "فشل حذف ملفات الصور من مساحة التخزين السحابية. تم إيقاف عملية حذف العقار لحماية البيانات.",
        };
      }
      storageDeletedCount = removeData?.length || storagePaths.length;
    }

    // 3. Delete property row from PostgreSQL (ON DELETE CASCADE cleans up public.property_images rows)
    const { error: dbDeleteError } = await supabase
      .from("properties")
      .delete()
      .eq("id", id);

    if (dbDeleteError) {
      console.error("Database property delete error:", dbDeleteError);
      // Safe edge case reporting: storage removed but database row deletion failed
      if (storageDeletedCount > 0) {
        return {
          success: false,
          error: "تمت إزالة ملفات الصور من مساحة التخزين، ولكن تعذر حذف سجل العقار من قاعدة البيانات. يرجى مراجعة حالة السجل.",
        };
      }
      return {
        success: false,
        error: "تعذر حذف العقار من قاعدة البيانات. يرجى التأكد من عدم ارتباطه بسجلات أخرى.",
      };
    }

    revalidatePath("/admin");
    revalidatePath("/properties");
    revalidatePath(`/properties/${id}`);

    return { success: true };
  } catch (error) {
    console.error("deleteProperty error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "حدث خطأ غير متوقع أثناء حذف العقار.",
    };
  }
}

/**
 * Fast status updater for inline admin table controls.
 */
export async function updatePropertyStatus(
  id: string,
  status: PropertyStatus
): Promise<ActionResult<void>> {
  try {
    await requireAdmin();

    const supabase = await createClient();

    const { error } = await supabase
      .from("properties")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("Error updating status:", error);
      return { success: false, error: "تعذر تعديل حالة العقار." };
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("updatePropertyStatus error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "تعذر تحديث حالة العقار.",
    };
  }
}

/**
 * Fast flag toggler (featured / offer) for inline admin controls.
 */
export async function togglePropertyFlag(
  id: string,
  field: "is_featured" | "is_offer",
  value: boolean
): Promise<ActionResult<void>> {
  try {
    await requireAdmin();

    const supabase = await createClient();

    const updatePayload =
      field === "is_featured"
        ? { is_featured: value, updated_at: new Date().toISOString() }
        : { is_offer: value, updated_at: new Date().toISOString() };

    const { error } = await supabase
      .from("properties")
      .update(updatePayload)
      .eq("id", id);

    if (error) {
      console.error(`Error toggling ${field}:`, error);
      return { success: false, error: "تعذر تعديل تمييز العقار." };
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error(`togglePropertyFlag error:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "تعذر تعديل تمييز العقار.",
    };
  }
}

/**
 * =====================================================================
 * PHASE 5: PROPERTY IMAGES & STORAGE SERVER ACTIONS
 * =====================================================================
 */

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit per image

/**
 * Fetches all images associated with a specific property, ordered by sort_order.
 */
export async function getPropertyImages(propertyId: string): Promise<PropertyImage[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("property_images")
      .select("*")
      .eq("property_id", propertyId)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching property images:", error.message);
      return [];
    }

    return (data as PropertyImage[]) || [];
  } catch (error) {
    console.error("Exception fetching property images:", error);
    return [];
  }
}

/**
 * Uploads a single property image to Supabase Storage and records it in public.property_images.
 * Strictly protected by requireAdmin() and Supabase Storage / RLS policies.
 */
export async function uploadPropertyImage(
  propertyId: string,
  formData: FormData
): Promise<ActionResult<PropertyImage>> {
  let uploadedStoragePath: string | null = null;
  try {
    // 1. Enforce admin identity
    await requireAdmin();

    const file = formData.get("file") as File | null;
    const isCoverParam = formData.get("is_cover") === "true";
    const sortOrderParam = formData.get("sort_order")
      ? Number(formData.get("sort_order"))
      : null;
    const altText = (formData.get("alt_text") as string)?.trim() || null;

    // 2. Validate file existence and size
    if (!file || !(file instanceof File) || file.size === 0) {
      return { success: false, error: "يرجى تحديد ملف صورة صالح للرفع." };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: "حجم الصورة يتجاوز الحد الأقصى المسموح به (10 ميغابايت لكل صورة).",
      };
    }

    // 3. Validate MIME type and file extension
    const mimeType = file.type.toLowerCase();
    const fileNameParts = file.name.split(".");
    const ext = fileNameParts.length > 1 ? fileNameParts.pop()!.toLowerCase() : "";

    if (!ALLOWED_MIME_TYPES.includes(mimeType) || !ALLOWED_EXTENSIONS.includes(ext)) {
      return {
        success: false,
        error: "نوع الملف غير مدعوم. الأنواع المسموحة هي JPG، PNG، WebP فقط.",
      };
    }

    // 4. Generate unique, predictable storage path: properties/{propertyId}/{unique-file-name}
    const safeExt = ext === "jpeg" ? "jpg" : ext;
    const uniqueFileName = `${Date.now()}-${crypto.randomUUID()}.${safeExt}`;
    const storagePath = `properties/${propertyId}/${uniqueFileName}`;
    uploadedStoragePath = storagePath;

    const supabase = await createClient();

    // 5. Upload buffer to Supabase Storage bucket 'property-images'
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from("property-images")
      .upload(storagePath, buffer, {
        contentType: mimeType,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError.message);
      return {
        success: false,
        error: "تعذر رفع الصورة إلى مساحة التخزين السحابية. يرجى المحاولة لاحقاً.",
      };
    }

    // 6. Retrieve public image URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("property-images").getPublicUrl(storagePath);

    // 7. Check existing images to determine sort_order and is_cover
    const { data: existingImages, error: fetchImagesErr } = await supabase
      .from("property_images")
      .select("id, is_cover, sort_order")
      .eq("property_id", propertyId);

    if (fetchImagesErr) {
      console.error("Error querying existing images:", fetchImagesErr.message);
    }

    const hasImages = Boolean(existingImages && existingImages.length > 0);
    const hasCover = Boolean(existingImages?.some((img) => img.is_cover));

    // First image uploaded is always primary cover unless a cover already exists and is not overridden
    const shouldBeCover = isCoverParam || !hasCover || !hasImages;

    // If new image is to be cover, unset existing covers
    if (shouldBeCover && hasCover) {
      await supabase
        .from("property_images")
        .update({ is_cover: false })
        .eq("property_id", propertyId);
    }

    // Determine sort order
    const maxSort =
      existingImages && existingImages.length > 0
        ? Math.max(...existingImages.map((img) => img.sort_order))
        : -1;
    const finalSortOrder = sortOrderParam !== null ? sortOrderParam : maxSort + 1;

    // 8. Insert record into public.property_images
    const { data: imageRecord, error: dbError } = await supabase
      .from("property_images")
      .insert({
        property_id: propertyId,
        storage_path: storagePath,
        public_url: publicUrl,
        alt_text: altText,
        sort_order: finalSortOrder,
        is_cover: shouldBeCover,
      })
      .select()
      .single();

    if (dbError || !imageRecord) {
      console.error("Database insert error for property image:", dbError);
      // Clean up orphan file from storage bucket
      await supabase.storage.from("property-images").remove([storagePath]);
      return {
        success: false,
        error: "فشل حفظ بيانات الصورة في قاعدة البيانات.",
      };
    }

    revalidatePath(`/admin/properties/${propertyId}/edit`);
    revalidatePath("/admin");
    revalidatePath(`/properties/${propertyId}`);

    return {
      success: true,
      data: imageRecord as PropertyImage,
    };
  } catch (error) {
    console.error("uploadPropertyImage error:", error);
    // Cleanup if storage file was created before failure
    if (uploadedStoragePath) {
      try {
        const supabase = await createClient();
        await supabase.storage.from("property-images").remove([uploadedStoragePath]);
      } catch {
        // Ignore secondary cleanup error
      }
    }
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "حدث خطأ غير متوقع أثناء معالجة رفع الصورة.",
    };
  }
}

/**
 * Deletes a property image from Supabase Storage and public.property_images.
 * If the deleted image was primary, automatically promotes another remaining image to primary.
 */
export async function deletePropertyImage(
  imageId: string
): Promise<ActionResult<void>> {
  try {
    await requireAdmin();

    const supabase = await createClient();

    // 1. Fetch image record
    const { data: imageRecord, error: findError } = await supabase
      .from("property_images")
      .select("*")
      .eq("id", imageId)
      .maybeSingle();

    if (findError || !imageRecord) {
      return { success: false, error: "الصورة المحددة غير موجودة أو تم حذفها مسبقاً." };
    }

    const { property_id: propertyId, storage_path: storagePath, is_cover: wasCover } =
      imageRecord;

    // 2. Delete storage object
    const { error: storageDelError } = await supabase.storage
      .from("property-images")
      .remove([storagePath]);

    if (storageDelError) {
      console.warn("Storage deletion warning:", storageDelError.message);
    }

    // 3. Delete database record
    const { error: dbDelError } = await supabase
      .from("property_images")
      .delete()
      .eq("id", imageId);

    if (dbDelError) {
      console.error("DB deletion error for property image:", dbDelError.message);
      return {
        success: false,
        error: "تعذر إزالة سجل الصورة من قاعدة البيانات.",
      };
    }

    // 4. If deleted image was primary, automatically promote the first remaining image
    if (wasCover) {
      const { data: remainingImages } = await supabase
        .from("property_images")
        .select("id")
        .eq("property_id", propertyId)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true })
        .limit(1);

      if (remainingImages && remainingImages.length > 0) {
        await supabase
          .from("property_images")
          .update({ is_cover: true })
          .eq("id", remainingImages[0].id);
      }
    }

    revalidatePath(`/admin/properties/${propertyId}/edit`);
    revalidatePath("/admin");
    revalidatePath(`/properties/${propertyId}`);

    return { success: true };
  } catch (error) {
    console.error("deletePropertyImage error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "حدث خطأ غير متوقع أثناء حذف الصورة.",
    };
  }
}

/**
 * Sets an image as the primary cover image for a property.
 * Automatically unsets previous primary image to guarantee uniqueness.
 */
export async function setPrimaryPropertyImage(
  imageId: string,
  propertyId: string
): Promise<ActionResult<void>> {
  try {
    await requireAdmin();

    const supabase = await createClient();

    // 1. Unset all primary flags for this property
    const { error: unsetError } = await supabase
      .from("property_images")
      .update({ is_cover: false })
      .eq("property_id", propertyId);

    if (unsetError) {
      console.error("Error unsetting primary cover:", unsetError.message);
      return { success: false, error: "تعذر تحديث حالة الصورة الرئيسية." };
    }

    // 2. Set target image as primary cover
    const { error: setError } = await supabase
      .from("property_images")
      .update({ is_cover: true })
      .eq("id", imageId)
      .eq("property_id", propertyId);

    if (setError) {
      console.error("Error setting primary cover:", setError.message);
      return { success: false, error: "تعذر تعيين الصورة المحددة كصورة رئيسية." };
    }

    revalidatePath(`/admin/properties/${propertyId}/edit`);
    revalidatePath("/admin");
    revalidatePath(`/properties/${propertyId}`);

    return { success: true };
  } catch (error) {
    console.error("setPrimaryPropertyImage error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "حدث خطأ غير متوقع أثناء تحديث الصورة الرئيسية.",
    };
  }
}

/**
 * Persists the sort order of property images.
 */
export async function reorderPropertyImages(
  propertyId: string,
  orderedImageIds: string[]
): Promise<ActionResult<void>> {
  try {
    await requireAdmin();

    const supabase = await createClient();

    // Perform atomic/sequential updates for each image index
    const updatePromises = orderedImageIds.map((id, index) =>
      supabase
        .from("property_images")
        .update({ sort_order: index })
        .eq("id", id)
        .eq("property_id", propertyId)
    );

    const results = await Promise.all(updatePromises);
    const failedUpdate = results.find((r) => r.error);

    if (failedUpdate?.error) {
      console.error("Error reordering images:", failedUpdate.error.message);
      return { success: false, error: "تعذر حفظ ترتيب الصور الجديد." };
    }

    revalidatePath(`/admin/properties/${propertyId}/edit`);
    revalidatePath("/admin");
    revalidatePath(`/properties/${propertyId}`);

    return { success: true };
  } catch (error) {
    console.error("reorderPropertyImages error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "حدث خطأ غير متوقع أثناء إعادة ترتيب الصور.",
    };
  }
}

/**
 * =====================================================================
 * PHASE 6: PUBLIC DATA ACCESS LAYER (SUPABASE RLS DATA SOURCE)
 * =====================================================================
 */

export interface PublicProperty extends Property {
  governorates: { id: string; name_ar: string; name_en: string } | null;
  districts: { id: string; name_ar: string; name_en: string } | null;
  property_images: PropertyImage[];
}

export interface PublicCatalogFilters {
  search?: string;
  deal?: string;
  governorate?: string;
  district?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  sortBy?: string;
}

/**
 * Loads all active governorates and districts for the public search and filter dropdowns.
 */
export async function getPublicLocations(): Promise<{
  governorates: Governorate[];
  districts: District[];
}> {
  try {
    const supabase = await createClient();
    const [govRes, distRes] = await Promise.all([
      supabase
        .from("governorates")
        .select("*")
        .eq("is_active", true)
        .order("name_ar", { ascending: true }),
      supabase
        .from("districts")
        .select("*")
        .eq("is_active", true)
        .order("name_ar", { ascending: true }),
    ]);

    return {
      governorates: (govRes.data as Governorate[]) || [],
      districts: (distRes.data as District[]) || [],
    };
  } catch (error) {
    console.error("Exception fetching public locations:", error);
    return { governorates: [], districts: [] };
  }
}

/**
 * Fetches publicly visible featured properties for the homepage.
 * Only properties with status = 'available' and is_featured = true are returned.
 */
export async function getPublicFeaturedProperties(limit: number = 6): Promise<PublicProperty[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("properties")
      .select("*, governorates(id, name_ar, name_en), districts(id, name_ar, name_en), property_images(*)")
      .eq("status", "available")
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching featured properties:", error.message);
      return [];
    }

    // Sort images by sort_order
    const properties = (data as unknown as PublicProperty[]) || [];
    properties.forEach((prop) => {
      if (prop.property_images && Array.isArray(prop.property_images)) {
        prop.property_images.sort((a, b) => a.sort_order - b.sort_order);
      }
    });

    return properties;
  } catch (error) {
    console.error("Exception fetching featured properties:", error);
    return [];
  }
}

/**
 * Fetches publicly visible special offer properties for the homepage.
 * Only properties with status = 'available' and is_offer = true are returned.
 */
export async function getPublicOfferProperties(limit: number = 6): Promise<PublicProperty[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("properties")
      .select("*, governorates(id, name_ar, name_en), districts(id, name_ar, name_en), property_images(*)")
      .eq("status", "available")
      .eq("is_offer", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching offer properties:", error.message);
      return [];
    }

    const properties = (data as unknown as PublicProperty[]) || [];
    properties.forEach((prop) => {
      if (prop.property_images && Array.isArray(prop.property_images)) {
        prop.property_images.sort((a, b) => a.sort_order - b.sort_order);
      }
    });

    return properties;
  } catch (error) {
    console.error("Exception fetching offer properties:", error);
    return [];
  }
}

/**
 * Fetches publicly visible properties for the catalog with optional search and filters.
 * Excludes draft and hidden properties strictly via status = 'available' (and PostgreSQL RLS).
 */
export async function getPublicProperties(
  filters?: PublicCatalogFilters
): Promise<PublicProperty[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("properties")
      .select("*, governorates(id, name_ar, name_en), districts(id, name_ar, name_en), property_images(*)")
      .eq("status", "available");

    // Apply filters
    if (filters?.deal && filters.deal !== "all") {
      query = query.eq("transaction_type", filters.deal as TransactionType);
    }
    if (filters?.governorate && filters.governorate !== "all") {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        filters.governorate
      );
      if (isUuid) {
        query = query.eq("governorate_id", filters.governorate);
      } else {
        // Find governorate by slug or English/Arabic name
        const cleanGov = filters.governorate.replace(/-/g, " ");
        const { data: matchedGov } = await supabase
          .from("governorates")
          .select("id")
          .or(`name_en.ilike.%${cleanGov}%,name_ar.ilike.%${cleanGov}%`)
          .limit(1)
          .maybeSingle();
        if (matchedGov) {
          query = query.eq("governorate_id", matchedGov.id);
        }
      }
    }
    if (filters?.district && filters.district !== "all") {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        filters.district
      );
      if (isUuid) {
        query = query.eq("district_id", filters.district);
      } else {
        const cleanDist = filters.district.replace(/-/g, " ");
        const { data: matchedDist } = await supabase
          .from("districts")
          .select("id")
          .or(`name_en.ilike.%${cleanDist}%,name_ar.ilike.%${cleanDist}%`)
          .limit(1)
          .maybeSingle();
        if (matchedDist) {
          query = query.eq("district_id", matchedDist.id);
        }
      }
    }
    if (filters?.type && filters.type !== "all") {
      query = query.eq("property_type", filters.type);
    }
    if (filters?.minPrice !== undefined && filters.minPrice > 0) {
      query = query.gte("price", filters.minPrice);
    }
    if (filters?.maxPrice !== undefined && filters.maxPrice > 0) {
      query = query.lte("price", filters.maxPrice);
    }
    if (filters?.bedrooms !== undefined && filters.bedrooms > 0) {
      query = query.gte("bedrooms", filters.bedrooms);
    }
    if (filters?.bathrooms !== undefined && filters.bathrooms > 0) {
      query = query.gte("bathrooms", filters.bathrooms);
    }
    if (filters?.search && filters.search.trim()) {
      const term = filters.search.trim();
      query = query.or(
        `title_ar.ilike.%${term}%,description_ar.ilike.%${term}%,address.ilike.%${term}%`
      );
    }

    // Sort order
    if (filters?.sortBy === "price-asc") {
      query = query.order("price", { ascending: true });
    } else if (filters?.sortBy === "price-desc") {
      query = query.order("price", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error querying public catalog properties:", error.message);
      return [];
    }

    const properties = (data as unknown as PublicProperty[]) || [];
    properties.forEach((prop) => {
      if (prop.property_images && Array.isArray(prop.property_images)) {
        prop.property_images.sort((a, b) => a.sort_order - b.sort_order);
      }
    });

    return properties;
  } catch (error) {
    console.error("Exception querying public catalog properties:", error);
    return [];
  }
}

/**
 * Fetches a single publicly visible property by ID.
 * Returns null if the property does not exist or is not 'available' (draft/hidden).
 */
export async function getPublicPropertyById(id: string): Promise<PublicProperty | null> {
  // Validate UUID format to prevent postgres invalid input syntax errors
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  if (!isUuid) {
    return null;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("properties")
      .select("*, governorates(id, name_ar, name_en), districts(id, name_ar, name_en), property_images(*)")
      .eq("id", id)
      .eq("status", "available")
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    const property = data as unknown as PublicProperty;
    if (property.property_images && Array.isArray(property.property_images)) {
      // Primary cover first, then by sort_order
      property.property_images.sort((a, b) => {
        if (a.is_cover) return -1;
        if (b.is_cover) return 1;
        return a.sort_order - b.sort_order;
      });
    }

    return property;
  } catch (error) {
    console.error("Exception fetching public property by id:", error);
    return null;
  }
}

/**
 * Fetches publicly visible latest properties for the homepage CMS section.
 * Only properties with status = 'available' are returned, sorted by created_at DESC.
 */
export async function getPublicLatestProperties(limit: number = 6): Promise<PublicProperty[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("properties")
      .select("*, governorates(id, name_ar, name_en), districts(id, name_ar, name_en), property_images(*)")
      .eq("status", "available")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching latest properties:", error.message);
      return [];
    }

    const properties = (data as unknown as PublicProperty[]) || [];
    properties.forEach((prop) => {
      if (prop.property_images && Array.isArray(prop.property_images)) {
        prop.property_images.sort((a, b) => a.sort_order - b.sort_order);
      }
    });

    return properties;
  } catch (error) {
    console.error("Exception fetching latest properties:", error);
    return [];
  }
}



