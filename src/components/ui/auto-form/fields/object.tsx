import * as z from "zod";
import { useForm } from "react-hook-form";
import {FieldConfig, FieldConfigItem, ObjectConfig, ObjectConfigItem} from "../types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../accordion";
import {
  beautifyObjectName,
  getBaseSchema,
  getBaseType,
  zodToHtmlInputProps,
} from "../utils";
import { FormField } from "../../form";
import {DEFAULT_ZOD_HANDLERS, INPUT_COMPONENTS,} from "../config";
import AutoFormArray from "./array";
import AutoFormObjectRow from "./object-row";
import AutoFormObjectTabs from "./object-tabs";

function DefaultParent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default function AutoFormObject<
  SchemaType extends z.ZodObject<any, any>,
>({
  schema,
  form,
  fieldConfig,
  objectConfig,
  path = [],
}: {
  schema: SchemaType | z.ZodEffects<SchemaType>;
  form: ReturnType<typeof useForm>;
  fieldConfig?: FieldConfig<z.infer<SchemaType>>;
  objectConfig?: ObjectConfig<z.infer<SchemaType>>;
  path?: string[];
}) {
  const { shape } = getBaseSchema<SchemaType>(schema);

  return (
    <Accordion type="multiple" className="space-y-5">
      {Object.keys(shape).map((name) => {
        const item = shape[name] as z.ZodAny;
        const zodBaseType = getBaseType(item);
        const itemName = item._def.description ?? beautifyObjectName(name);
        const key = [...path, name].join(".");
        const fieldConfigItem: FieldConfigItem = fieldConfig?.[name] ?? {};

        if (zodBaseType === "ZodObject") {
          const objectConfigItem: ObjectConfigItem = objectConfig?.[name] ?? {};
          const objectType =
              objectConfigItem?.layoutType ??
              "fallback";
          switch (objectType) {
              case "row":
                return (
                    <AutoFormObjectRow
                        key={key}
                        schema={item as unknown as z.ZodObject<any, any>}
                        form={form}
                        fieldConfig={
                            (fieldConfig?.[name] ?? {}) as FieldConfig<
                                z.infer<typeof item>
                            >
                        }
                        rowDivProps={objectConfigItem?.divProps ?? {}}
                        path={[...path, name]}
                    />
                )
              case "tabs":
                  return (
                      <AutoFormObjectTabs
                          key={key}
                          schema={item as unknown as z.ZodObject<any, any>}
                          form={form}
                          fieldConfig={
                              (fieldConfig?.[name] ?? {}) as FieldConfig<
                                  z.infer<typeof item>
                              >
                          }
                          objectConfig={(objectConfig?.[name] ?? {}) as ObjectConfig<
                              z.infer<typeof item>
                          >}
                          path={[...path, name]}
                      />
                  )
              case "fallback":
              default:
                  return (
                      <AccordionItem value={name} key={key}>
                          <AccordionTrigger>{itemName}</AccordionTrigger>
                          <AccordionContent className="p-2">
                              <AutoFormObject
                                  schema={item as unknown as z.ZodObject<any, any>}
                                  form={form}
                                  fieldConfig={
                                      (fieldConfig?.[name] ?? {}) as FieldConfig<
                                          z.infer<typeof item>
                                      >
                                  }
                                  path={[...path, name]}
                              />
                          </AccordionContent>
                      </AccordionItem>
                  );
          }
        }
        if (zodBaseType === "ZodArray") {
          return (
            <AutoFormArray
              key={key}
              name={name}
              item={item as unknown as z.ZodArray<any>}
              form={form}
              path={[...path, name]}
            />
          );
        }


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
    </Accordion>
  );
}
