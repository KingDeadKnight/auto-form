import * as z from "zod";
import AutoForm, { AutoFormSubmit } from "../components/ui/auto-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

enum Sports {
  Football = "Football/Soccer",
  Basketball = "Basketball",
  Baseball = "Baseball",
  Hockey = "Hockey (Ice)",
  None = "I don't like sports",
}

const formSchema = z.object({

    firstRow: z.object({
        username: z
            .string({
                required_error: "Username is required.",
            })
            .min(2, {
                message: "Username must be at least 2 characters.",
            }),
        password: z
            .string({
                required_error: "Password is required.",
            })
            .describe("Your secure password")
            .min(8, {
                message: "Password must be at least 8 characters.",
            }),
    }),
    secondRow: z.object({
        name: z
            .string({
                required_error: "Username is required.",
            })
            .min(2, {
                message: "Username must be at least 2 characters.",
            }),
        word: z
            .enum(["not many", "a few", "a lot", "too many"])
            .describe("How many marshmallows fit in your mouth?"),
    }),
    tabs: z.object({
        fr: z.object({
            secondRow: z.object({
                name: z
                    .string({
                        required_error: "Username is required.",
                    })
                    .min(2, {
                        message: "Username must be at least 2 characters.",
                    }),
                word: z
                    .enum(["not many", "a few", "a lot", "too many"])
                    .describe("How many marshmallows fit in your mouth?"),
            }),
        }).describe('Français'),
        nl: z.object({
            name: z
                .string({
                    required_error: "NameNL is required.",
                }),
        }).describe('Néerlandais')
    })
});

function Basics() {
  return (
    <>
      <div className="mx-auto my-6 max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle>AutoForm Example</CardTitle>
            <CardDescription>
              Automatically generate a form from a Zod schema.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <AutoForm
              formSchema={formSchema}
              onSubmit={console.log}
              fieldConfig={{
                  firstRow: {
                    password: {
                      inputProps: {
                        type: "password",
                        placeholder: "••••••••",
                      },
                    },
                  },
                  secondRow: {
                      word: {
                          fieldType: "radio",
                      }
                  }
                // favouriteNumber: {
                //   description: "Your favourite number between 1 and 10.",
                // },
                // acceptTerms: {
                //   inputProps: {
                //     required: true,
                //   },
                //   description: (
                //     <>
                //       I agree to the{" "}
                //       <button
                //         className="text-primary underline"
                //         onClick={(e) => {
                //           e.preventDefault();
                //           alert("Terms and conditions clicked.");
                //         }}
                //       >
                //         terms and conditions
                //       </button>
                //       .
                //     </>
                //   ),
                // },
                //
                // birthday: {
                //   description: "We need your birthday to send you a gift.",
                // },
                //
                // sendMeMails: {
                //   fieldType: "switch",
                // },
                //
                // bio: {
                //   fieldType: "textarea",
                // },
                //
                // marshmallows: {
                //   fieldType: "radio",
                // },
                //
                // customParent: {
                //   renderParent: ({ children }) => (
                //     <div className="flex items-end gap-3">
                //       <div className="flex-1">{children}</div>
                //       <div>
                //         <Button type="button">Check</Button>
                //       </div>
                //     </div>
                //   ),
                // },
              }}
              objectConfig={{
                  firstRow: {
                      layoutType: "row",
                      divProps: {
                          className: "space-x-12"
                      }
                  },
                  secondRow: {
                      layoutType: "row"
                  },
                  tabs: {
                      layoutType: "tabs",
                      fr: {
                          secondRow: {
                              layoutType: "row",
                          }
                      }
                  }
              }}
            >
              <AutoFormSubmit>Send now</AutoFormSubmit>
            </AutoForm>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default Basics;
