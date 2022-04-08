import { useEffect } from "react";

export const useAsyncEffect = (
  asyncFn: (stillMounted: () => boolean) => Promise<void>,
  deps: Parameters<typeof useEffect>['1'],
  destroy?: ReturnType<Parameters<typeof useEffect>['0']>
) =>
  useEffect(() => {
    let stillMounted = true;

    asyncFn(() => stillMounted);

    return () => {
      stillMounted = false;

      if (destroy) destroy();
    };
  }, deps);
