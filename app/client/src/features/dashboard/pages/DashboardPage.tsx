import { Paper } from "@/components/paper/Paper";
import { ContentWrapper } from "@/components/wrappers/content-wrapper/ContentWrapper";

export const DashboardPage = () => {
  return (
    <ContentWrapper>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        <div className="lg:col-span-8 min-h-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
            <Paper>
              <>Info 01 </>
            </Paper>
            <Paper>
              <>Info 02 </>
            </Paper>
            <Paper>
              <>Info 03</>
            </Paper>
            <Paper>
              <>Info 04</>
            </Paper>
          </div>
        </div>
        <div className="lg:col-span-4 min-h-0">
          <div className="h-full min-h-[260px] lg:min-h-[420px]">
            <Paper>
              <>Grafico grande a direita</>
            </Paper>
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
};
