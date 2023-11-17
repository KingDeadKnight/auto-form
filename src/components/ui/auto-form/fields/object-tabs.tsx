import * as z from "zod";
import { useForm } from "react-hook-form";
import {FieldConfig, ObjectConfig} from "../types";
import {
  beautifyObjectName,
  getBaseSchema,
  getBaseType,
} from "../utils";
import {cn} from "@/lib/utils.ts";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import AutoFormObject from "@/components/ui/auto-form/fields/object.tsx";


export default function AutoFormObjectTabs<
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

  const onlyZodObjectsKeyName = Object.keys(shape).filter((name) => {
      const item = shape[name] as z.ZodAny;
      const zodBaseType = getBaseType(item);
      return zodBaseType === "ZodObject";
  })

  const firstElementValue = shape[onlyZodObjectsKeyName[0]]._def.description ?? beautifyObjectName(onlyZodObjectsKeyName[0])

  function isPropertyExists(obj: any, args: string[]) {
    return args.reduce((obj, level) => obj && obj[level], obj) != undefined
  }

  return (
      <Tabs defaultValue={firstElementValue} >
          <TabsList className="w-full">
              {onlyZodObjectsKeyName.map(name => {
                  const item = shape[name] as z.ZodAny;
                  const itemName = item._def.description ?? beautifyObjectName(name);
                  const needAttention = isPropertyExists(form.formState.errors, [...path, name]);
                  const triggerKey = [...path, name, 'trigger'].join(".");
                  return (
                        <TabsTrigger key={triggerKey} className={cn("w-full", needAttention && "text-red-600 data-[state=active]:text-red-600")} value={itemName}>{itemName}</TabsTrigger>
                  )
              })}
          </TabsList>
          {onlyZodObjectsKeyName.map(name => {
              const item = shape[name] as z.ZodAny;
              const itemName = item._def.description ?? beautifyObjectName(name);
              const key = [...path, name].join(".");
              return (
                  <TabsContent value={itemName} key={key}>
                      <AutoFormObject
                          schema={item as unknown as z.ZodObject<any, any>}
                          form={form}
                          fieldConfig={
                              (fieldConfig?.[name] ?? {}) as FieldConfig<
                                  z.infer<typeof item>
                              >
                          }
                          objectConfig={
                              (objectConfig?.[name] ?? {}) as ObjectConfig<
                                  z.infer<typeof item>
                              >
                          }
                          path={[...path, name]}
                      />
                  </TabsContent>
              )
          })}
      </Tabs>
  );
}
