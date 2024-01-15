import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useProps } from '@hooks/useProps';
import { addUserData } from '@services/user/post';
import { Loader2 } from 'lucide-react';
import { useDeepCompareEffect } from 'rooks';

import { Button } from '@ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/select';

const formSchema = z.object({
  dark_mode: z.union([
    z.literal('light'),
    z.literal('dark'),
    z.literal('system'),
  ]),
  preferred_tss_type: z.union([z.literal('pace'), z.literal('hr')]),
});

export function PreferencesForm() {
  const { userSettings, theme } = useProps();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dark_mode: undefined,
      preferred_tss_type:
        userSettings?.data?.preferences?.preferred_tss_type ?? 'pace',
    },
  });

  useDeepCompareEffect(() => {
    if (userSettings?.data) {
      form.reset({
        dark_mode: userSettings.data.dark_mode,
        preferred_tss_type: userSettings.data.preferences.preferred_tss_type,
      });
    }
  }, [userSettings?.data, form]);

  theme.setThemeType(form.watch('dark_mode'));

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!userSettings?.data) return;

    const newSettings = {
      ...userSettings.data,
      dark_mode: values.dark_mode,
      preferences: {
        ...userSettings.data.preferences,
      },
    };

    await addUserData({
      body: newSettings,
    }).then(() => {
      userSettings?.refetchData({
        cacheOnly: true,
      });
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="dark_mode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Theme</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger
                    disabled={userSettings?.isLoading}
                    className="w-36"
                  >
                    <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="preferred_tss_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred TSS type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger
                    disabled={userSettings?.isLoading}
                    className="w-36"
                  >
                    <SelectValue placeholder="TSS Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pace">Pace</SelectItem>
                  <SelectItem value="hr">Heart Rate</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <div className="flex flex-col items-center">
          <Button disabled={userSettings?.isLoading} type="submit">
            Save
            {userSettings?.isLoading && (
              <Loader2 className="animate-spin ml-2" size={16} />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
