import { Paper } from "@/components/paper/Paper";
import { ContentWrapper } from "@/components/wrappers/content-wrapper/ContentWrapper";
import { Fragment } from "react/jsx-runtime";

export const DashboardPage = () => {
  return (
    <ContentWrapper>
      <div>
        <Paper>
          <>Info 01 - Numero de Funcionario</>
        </Paper>
        <Paper>
          <>Info 01 - Numero de Setores</>
        </Paper>
        <Paper>
          <>Info 01 - Brindes enviados</>
        </Paper>
        <Paper>
          <>Info 01 - Funcionarios aniversariantes</>
        </Paper>
      </div>
      <div>
        <Paper>
          <>Grafico grande a direita</>
        </Paper>
      </div>
    </ContentWrapper>
  );
};
