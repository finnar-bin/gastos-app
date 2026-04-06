import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRef } from "react";

import { SheetPagePlaceholder } from "@/src/ui/SheetPagePlaceholder";
import { useCreateSheetTransactionMutation } from "@/src/queries/use-create-sheet-transaction-mutation";
import { useSession } from "@/src/providers/SessionProvider";
import { TransactionForm } from "@/src/ui/TransactionForm";
import { toSheetId } from "@/src/utils/to-sheet-id";

export default function SheetTransactionFormPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ sheetId?: string | string[] }>();
  const sheetId = toSheetId(params.sheetId) ?? null;
  const { session } = useSession();
  const createTransactionMutation = useCreateSheetTransactionMutation(sheetId);
  const scrollViewRef = useRef<ScrollView>(null);

  return (
    <>
      <Stack.Screen options={{ title: "Add Transaction" }} />
      <SafeAreaView edges={["top"]} className="flex-1 bg-canvas">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            ref={scrollViewRef}
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={{ padding: 24, gap: 16 }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={
              Platform.OS === "ios" ? "interactive" : "on-drag"
            }
            automaticallyAdjustKeyboardInsets
            className="flex-1"
          >
            {!sheetId ? (
              <SheetPagePlaceholder
                pageTitle="Transaction Form"
                pageDescription="A sheet id is required to create a transaction."
                sheetId={sheetId}
              />
            ) : (
              <TransactionForm
                sheetId={sheetId}
                submitLabel="Save Transaction"
                cancelLabel="Cancel"
                isSubmitting={createTransactionMutation.isPending}
                onCancel={() => router.back()}
                onDescriptionFocus={(target) => {
                  setTimeout(() => {
                    (
                      scrollViewRef.current as unknown as {
                        scrollResponderScrollNativeHandleToKeyboard: (
                          nodeHandle: number,
                          additionalOffset: number,
                          preventNegativeScrollOffset: boolean,
                        ) => void;
                      } | null
                    )?.scrollResponderScrollNativeHandleToKeyboard(
                      target,
                      140,
                      true,
                    );
                  }, 120);
                }}
                onSubmit={async (values) => {
                  const userId = session?.user.id;

                  if (!userId) {
                    throw new Error(
                      "You must be logged in to create a transaction.",
                    );
                  }

                  await createTransactionMutation.mutateAsync({
                    sheetId,
                    createdBy: userId,
                    amount: values.amount,
                    type: values.transactionType,
                    date: values.date,
                    categoryId: values.categoryId,
                    paymentTypeId: values.paymentTypeId,
                    description: values.description,
                  });
                }}
              />
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}
