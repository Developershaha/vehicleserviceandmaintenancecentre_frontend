import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import VehicleInput from "../../common/VehicleInput";
import VehicleAutoSelectField from "../../common/VehicleAutoSelectField";
import axiosInstance from "../../auth/pages/apis/axiosInstance";
import { showSnackbar } from "../../../store/snackbarSlice";
import { useAppDispatch } from "../../../store/hook";
import { useEffect, useState } from "react";

// Services
const SERVICE_OPTIONS = [
  { label: "Oil & Filter", value: "oil_filter" },
  { label: "Tire Services", value: "tire" },
  { label: "Brake Service", value: "brake" },
  { label: "Fluid Top-Ups", value: "fluid" },
  { label: "Battery Service", value: "battery" },
  { label: "Air Filters", value: "air_filter" },
  { label: "Car AC Service", value: "ac" },
  { label: "Electrical Repairs", value: "electrical" },
  { label: "Denting & Paint", value: "denting" },
  { label: "Diagnostics", value: "diagnostics" },
  { label: "Other", value: "other" },
];

// Validation
const validationSchema = Yup.object({
  services: Yup.array().of(
    Yup.object({
      serviceType: Yup.string().required("Service required"),

      customService: Yup.string().when("serviceType", {
        is: "other",
        then: (schema) => schema.required("Enter service name"),
      }),

      quantity: Yup.number()
        .typeError("Enter valid qty")
        .required("Quantity required"),

      price: Yup.number()
        .typeError("Enter valid price")
        .required("Price required"),
    }),
  ),
  discount: Yup.number()
    .typeError("Enter valid discount")
    .required("discount required"),
});

const GenerateBillPopup = ({
  open,
  onClose,
  fetchBillings,
  selectedRow,
}: any) => {
  const dispatch = useAppDispatch();
  const [initialData, setInitialData] = useState(null);
  const mapApiToFormik = (data: any) => {
    if (!data) return null;

    return {
      services: data.billItemList.map((item: any) => {
        const matchedService = SERVICE_OPTIONS.find(
          (opt) => opt.label === item.biServiceName,
        );

        return {
          serviceType: matchedService?.value || "other",
          customService: matchedService ? "" : item.biServiceName,
          quantity: item.biQuantity,
          price: item.biRate,
        };
      }),

      discount: data.bill?.bDiscount || 0,
    };
  };
  const getExtraBillDetails = async (bId: number) => {
    try {
      const response = await axiosInstance.get(`add-bill/extra-details`, {
        params: { bId },
      });

      const entity = response?.data?.entity;

      setInitialData(entity);
    } catch (error) {
      console.error("Error fetching extra details", error);
      throw error;
    }
  };
  useEffect(() => {
    if (!selectedRow?.bId) return;

    getExtraBillDetails(selectedRow?.bId);
  }, [selectedRow]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[950px] max-h-[90vh] overflow-y-auto rounded-xl shadow-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Generate Bill</h2>

        <Formik
          enableReinitialize
          initialValues={
            initialData
              ? mapApiToFormik(initialData)
              : {
                  services: [
                    {
                      serviceType: "",
                      customService: "",
                      quantity: 1,
                      price: "",
                    },
                  ],
                  discount: "",
                }
          }
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            const calculateRowTotal = (item: any) => item.quantity * item.price;

            const subTotal = values.services.reduce(
              (sum: any, item: any) => sum + calculateRowTotal(item),
              0,
            );
            const payload = {
              addBillItemJson: values.services.map((item: any) => {
                return {
                  biId: selectedRow?.bId || undefined,

                  biServiceName:
                    item.serviceType === "other"
                      ? item.customService
                      : SERVICE_OPTIONS.find(
                          (opt) => opt.value === item.serviceType,
                        )?.label,

                  biQuantity: item.quantity,
                  biRate: item.price,
                  biTotal: calculateRowTotal(item),
                };
              }),

              bId: initialData?.bill?.bId,
              bAptId: selectedRow?.aptId,
              bJcId: selectedRow?.jcId,
              bTotal: subTotal,
              bDiscount: values.discount,
              bFinalTotal: subTotal - (subTotal * values.discount) / 100,
            };
            let response;

            if (selectedRow?.bId) {
              // ✅ UPDATE API
              response = await axiosInstance.put("/edit-bill", payload);
            } else {
              // ✅ CREATE API
              response = await axiosInstance.post("/add-bill", payload);
            }
            if (
              response?.data?.validationCode === "finance.bill.add.success" ||
              response?.data?.validationCode === "finance.bill.edit.success"
            ) {
              dispatch(
                showSnackbar({
                  message: selectedRow?.bId
                    ? "Bill updated successfully"
                    : "Bill generated successfully",
                  type: "success",
                }),
              );

              fetchBillings();
              onClose();
            }
          }}
        >
          {(formik) => {
            const calculateRowTotal = (item: any) => item.quantity * item.price;

            const subTotal = formik.values.services.reduce(
              (sum, item) => sum + calculateRowTotal(item),
              0,
            );

            const finalAmount =
              subTotal - (subTotal * (formik.values.discount || 0)) / 100;

            return (
              <Form className="space-y-4">
                {/* SERVICES */}
                <FieldArray name="services">
                  {({ push, remove }) => (
                    <div className="space-y-3">
                      {formik.values.services.map((service, index) => {
                        const isOther = service.serviceType === "other";

                        return (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 border rounded-xl bg-white shadow-sm"
                          >
                            {/* Service */}
                            <div
                              className={`${isOther ? "w-[200px]" : "w-[250px]"}`}
                            >
                              <VehicleAutoSelectField
                                label="Service"
                                name={`services.${index}.serviceType`}
                                value={SERVICE_OPTIONS.find(
                                  (opt) => opt.value === service.serviceType,
                                )}
                                options={SERVICE_OPTIONS}
                                onChange={(val) => {
                                  formik.setFieldValue(
                                    `services.${index}.serviceType`,
                                    val?.value,
                                  );

                                  if (val?.value !== "other") {
                                    formik.setFieldValue(
                                      `services.${index}.customService`,
                                      "",
                                    );
                                  }
                                }}
                                onBlur={formik.handleBlur}
                                error={
                                  formik.touched.services?.[index]
                                    ?.serviceType &&
                                  formik.errors.services?.[index]?.serviceType
                                }
                                touched={
                                  formik.touched.services?.[index]?.serviceType
                                }
                                required
                              />
                            </div>

                            {/* Custom */}
                            {isOther && (
                              <div className="w-[200px]">
                                <VehicleInput
                                  label="Custom"
                                  name={`services.${index}.customService`}
                                  value={service.customService}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  error={
                                    formik.touched.services?.[index]
                                      ?.customService &&
                                    formik.errors.services?.[index]
                                      ?.customService
                                  }
                                  touched={
                                    formik.touched.services?.[index]
                                      ?.customService
                                  }
                                />
                              </div>
                            )}

                            {/* Qty */}
                            <div className="w-[120px]">
                              <VehicleInput
                                label="Qty"
                                name={`services.${index}.quantity`}
                                type="number"
                                required
                                inputProps={{ min: 0 }}
                                value={service.quantity}
                                onChange={(e) => {
                                  const value = e.target.value;

                                  // Prevent negative & invalid values
                                  if (value === "" || Number(value) >= 0) {
                                    formik.setFieldValue(
                                      `services.${index}.quantity`,
                                      value === "" ? "" : Number(value),
                                    );
                                  }
                                }}
                                onKeyDown={(e) => {
                                  // Block invalid keys
                                  if (["e", "E", "+", "-"].includes(e.key)) {
                                    e.preventDefault();
                                  }
                                }}
                                onBlur={formik.handleBlur}
                                error={
                                  formik.touched.services?.[index]?.quantity &&
                                  formik.errors.services?.[index]?.quantity
                                }
                                touched={
                                  formik.touched.services?.[index]?.quantity
                                }
                              />
                            </div>

                            {/* Price */}
                            <div className="w-[140px]">
                              <VehicleInput
                                label="Price"
                                name={`services.${index}.price`}
                                type="number"
                                inputProps={{ min: 0, step: 0.01 }}
                                value={service.price}
                                onChange={(e) => {
                                  const value = e.target.value;

                                  // Allow empty OR valid positive numbers
                                  if (value === "" || Number(value) >= 0) {
                                    formik.setFieldValue(
                                      `services.${index}.price`,
                                      value === "" ? "" : Number(value),
                                    );
                                  }
                                }}
                                onKeyDown={(e) => {
                                  // Block invalid keys
                                  if (["e", "E", "+", "-"].includes(e.key)) {
                                    e.preventDefault();
                                  }
                                }}
                                onBlur={formik.handleBlur}
                                error={
                                  formik.touched.services?.[index]?.price &&
                                  formik.errors.services?.[index]?.price
                                }
                                touched={
                                  formik.touched.services?.[index]?.price
                                }
                              />
                            </div>

                            {/* Total */}
                            <div className="w-[90px] text-center pt-6">
                              <div className="bg-green-100 text-green-700 font-semibold px-2 py-1 rounded-md text-sm">
                                ₹ {calculateRowTotal(service) || 0}
                              </div>
                            </div>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              disabled={formik.values.services.length === 1}
                              className="text-red-500 hover:bg-red-100 p-2 rounded-md mt-5"
                            >
                              🗑
                            </button>
                          </div>
                        );
                      })}

                      {/* Add */}
                      <button
                        type="button"
                        onClick={() =>
                          push({
                            serviceType: "",
                            customService: "",
                            quantity: 1,
                            price: "",
                          })
                        }
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        + Add Service
                      </button>
                    </div>
                  )}
                </FieldArray>

                {/* SUMMARY */}
                <div className="mt-6 p-4 border rounded-xl bg-gray-50 space-y-2">
                  <VehicleInput
                    label="Discount (%)"
                    name="discount"
                    required
                    type="number"
                    inputProps={{ min: 0, max: 99, step: 1 }}
                    value={formik.values.discount}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Allow empty OR valid range 0–99
                      if (
                        value === "" ||
                        (Number(value) >= 0 && Number(value) <= 99)
                      ) {
                        formik.setFieldValue(
                          "discount",
                          value === "" ? "" : Number(value),
                        );
                      }
                    }}
                    onKeyDown={(e) => {
                      // Block invalid keys
                      if (["e", "E", "+", "-"].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched?.discount && formik.errors?.discount}
                    touched={formik.touched?.discount}
                  />

                  <div>
                    Subtotal:{" "}
                    <span className="font-semibold">₹ {subTotal}</span>
                  </div>

                  <div className="text-lg font-bold text-blue-600">
                    Final Amount: ₹ {finalAmount}
                  </div>
                </div>

                {/* FOOTER */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Generate Bill
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default GenerateBillPopup;
