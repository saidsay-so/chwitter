import { CanceledError } from "axios";
import { useEffect, useState, useTransition } from "react";
import { Severity } from "../components/Toast";
import { useToast } from "../providers/ToastProvider";

export const enum ServiceStatus {
  LOADING,
  ERROR,
  FINISHED,
}

export const useService = <R>(
  service: (signal: AbortSignal) => Promise<R>,
  callback?: (res: R) => unknown,
  deps?: Parameters<typeof useEffect>["1"],
  destroy?: ReturnType<Parameters<typeof useEffect>["0"]>
) => {
  const [serviceLoading, setServiceLoading] = useState(true);
  const [_, startTransition] = useTransition();
  const { report } = useToast();
  let error: null | any = null;

  useEffect(() => {
    let stillMounted = true;
    const controller = new AbortController();

    service(controller.signal)
      .then((res) => {
        if (stillMounted && callback) {
          startTransition(() => {
            callback(res);
            setServiceLoading(false);
          });
        }
      })
      .catch((e) => {
        setServiceLoading(false);
        if (!(e instanceof CanceledError)) {
          error = e;
          report({ severity: Severity.ERROR, error });
        }
      });

    return () => {
      stillMounted = false;
      controller.abort();
      if (destroy) destroy();
    };
  }, deps);

  return {
    get status() {
      return error !== null
        ? ServiceStatus.ERROR
        : serviceLoading
        ? ServiceStatus.LOADING
        : ServiceStatus.FINISHED;
    },
    error,
  };
};

export * from "./messages-reducer";
