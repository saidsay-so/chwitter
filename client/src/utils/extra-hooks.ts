import { useEffect } from "react";

export const useAsyncEffect = (asyncFn, deps, destroy) =>
  useEffect(() => {
    let stillMounted = true;
    let res;

    asyncFn(() => stillMounted).then((value) => {
      res = value;
    });

    return () => {
      stillMounted = false;

      if (destroy) destroy(res);
    };
  }, deps);
