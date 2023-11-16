import * as z from "zod";
import { useForm } from "react-hook-form";
import {FieldConfig, FieldConfigItem} from "../types";
import {
  beautifyObjectName,
  getBaseSchema,
  getBaseType,
  zodToHtmlInputProps,
} from "../utils";
import { FormField } from "../../form";
import {DEFAULT_ZOD_HANDLERS, INPUT_COMPONENTS,} from "../config";

function DefaultParent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default function AutoFormObjectColumns<
  SchemaType extends z.ZodObject<any, any>,
>({
  schema,
  form,
  fieldConfig,
  path = [],
}: {
  schema: SchemaType | z.ZodEffects<SchemaType>;
  form: ReturnType<typeof useForm>;
  fieldConfig?: FieldConfig<z.infer<SchemaType>>;
  path?: string[];
}) {
  const { shape } = getBaseSchema<SchemaType>(schema);

  return (
      <div className="flex space-x-2">
          {Object.keys(shape).map((name) => {
              const item = shape[name] as z.ZodAny;
              const zodBaseType = getBaseType(item);
              const itemName = item._def.description ?? beautifyObjectName(name);
              const key = [...path, name].join(".");
              const fieldConfigItem: FieldConfigItem = fieldConfig?.[name] ?? {};
              const zodInputProps = zodToHtmlInputProps(item);
              const isRequired =
                  zodInputProps.required ||
                  fieldConfigItem.inputProps?.required ||
                  false;

              return (
                  <FormField
                      control={form.control}
                      name={key}
                      key={key}
                      render={({ field }) => {
                          const inputType =
                              fieldConfigItem.fieldType ??
                              DEFAULT_ZOD_HANDLERS[zodBaseType] ??
                              "fallback";

                          const InputComponent =
                              typeof inputType === "function"
                                  ? inputType
                                  : INPUT_COMPONENTS[inputType];
                          const ParentElement =
                              fieldConfigItem.renderParent ?? DefaultParent;

                          return (
                              <ParentElement key={`${key}.parent`}>
                                  <InputComponent
                                      zodInputProps={zodInputProps}
                                      field={field}
                                      fieldConfigItem={fieldConfigItem}
                                      label={itemName}
                                      isRequired={isRequired}
                                      zodItem={item}
                                      fieldProps={{
                                          ...zodInputProps,
                                          ...field,
                                          ...fieldConfigItem.inputProps,
                                          value: !fieldConfigItem.inputProps?.defaultValue
                                              ? field.value ?? ""
                                              : undefined,
                                      }}
                                  />
                              </ParentElement>
                          );
                      }}
                  />
              );
          })}
      </div>
  );
}
